# coding: utf-8

import os
DEVICE_NO = "4"
os.environ["CUDA_VISIBLE_DEVICES"] = DEVICE_NO

#importing
import os
import ipdb
import pandas as pd
import numpy as np
from tqdm.notebook import tqdm
from sklearn.model_selection import train_test_split
from transformers import BertForSequenceClassification
from kobert_tokenizer import KoBERTTokenizer
import torch
from torch.utils.data import Dataset
import torch.nn as nn
from transformers import BertModel
from transformers import Trainer, TrainingArguments
from torch.optim import AdamW
from transformers import EarlyStoppingCallback

MODEL_CHECKPOINT = "skt/kobert-base-v1"
FLAG="1"
TARGET_COORD = 'y' #x or y
SEED = 148177255
SLICE = -1 # -1 to use all the data(about 160k)
#CUDA
DEVICE_NAME = "cuda"

# Hyperparameters
EPOCHS = 100 #EarlyStopping 때문에 실제로는 이 정도 가지 않을 것
BATCH_SIZE = 96
BATCH_SIZE_EVAL = BATCH_SIZE*2
METRIC_NAME = "L1"

LOSS_FN_GLOBAL = nn.L1Loss()

def compute_metrics(eval_pred):
    predictions = torch.tensor(eval_pred.predictions)
    label_ids  = torch.tensor(eval_pred.label_ids).view(-1,1)
    val = LOSS_FN_GLOBAL(predictions, label_ids)
    return {METRIC_NAME: val}

# Dataset with Tokenizer
# https://github.com/SKTBrain/KoBERT/tree/master/kobert_hf 참조
#   https://hoit1302.tistory.com/159
#   pip install 'git+https://github.com/SKTBrain/KoBERT.git#egg=kobert_tokenizer&subdirectory=kobert_hf'

# Load the dataset
file_path = './bygpt.csv'
df_raw = pd.read_csv(file_path)

# Convert height_label and positivity_label to float
df_raw['x'] = df_raw['x'].astype(np.float32)
df_raw['y'] = df_raw['y'].astype(np.float32)
df_raw['label'] = df_raw[TARGET_COORD];
df = df_raw.sample(frac=1, random_state=SEED).reset_index(drop=True)
print(df[:5])

if(SLICE == -1): SLICE = len(df);

tokenizer = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1')
tokenizer_train = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1', sp_model_kwargs={'nbest_size': -1, 'alpha': 0.6, 'enable_sampling': True})
train_df, temp_df = train_test_split(df[:SLICE], test_size=0.2, random_state=SEED)
val_df, test_df = train_test_split(temp_df, test_size=0.5, random_state=SEED)
train_df = train_df.reset_index(drop=True)
val_df = val_df.reset_index(drop=True)
test_df = test_df.reset_index(drop=True)

class CustomDataset(Dataset):
    def __init__(self, dataframe, tokenizer, max_len):
        self.tokenizer = tokenizer
        self.data = dataframe
        self.text = dataframe.text
        self.label = dataframe.label
        self.max_len = max_len

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        text = str(self.text[index])
        label = self.label[index]

        inputs = self.tokenizer.encode_plus(
            text,
            None,
            add_special_tokens=True,
            max_length=self.max_len,
            # pad_to_max_length=True,
            padding = 'max_length',
            return_token_type_ids=True,
            return_attention_mask=True,
            truncation=True
        )

        input_ids = inputs['input_ids']
        attention_mask = inputs['attention_mask']
        token_type_ids = inputs['token_type_ids']

        return {
            'input_ids': torch.tensor(input_ids, dtype=torch.long),
            'attention_mask': torch.tensor(attention_mask, dtype=torch.long),
            'token_type_ids': torch.tensor(token_type_ids, dtype=torch.long),
            'label': torch.tensor(label, dtype=torch.float),
        }
        
max_len = 512
train_dataset = CustomDataset(train_df, tokenizer_train, max_len)
val_dataset = CustomDataset(val_df, tokenizer, max_len)
test_dataset = CustomDataset(test_df, tokenizer, max_len)

#Model
def model_init(trial = None):
    return BertForSequenceClassification.from_pretrained('./skt/kobert-base-v1-finetuned-1/checkpoint-4101', num_labels=1, ignore_mismatched_sizes=True)

#TrainingArguments
args = TrainingArguments(
    f"{MODEL_CHECKPOINT}-finetuned-{FLAG}",
    eval_strategy = "epoch",
    save_strategy = "epoch",
    logging_strategy = "epoch",
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE_EVAL,
    num_train_epochs=EPOCHS, 
    load_best_model_at_end = True,
    metric_for_best_model = "L1",
    greater_is_better = False,
    push_to_hub =False,
    learning_rate = 0.00002949510857460515,
    warmup_ratio = 0.001284997627332588,
    # use_cpu = True,
)
args.LR_CLASSIFIER_MULT = 13 # Illegal Argument Injection

# create_optimizer 에서 새 Optimizer를 전달하기만 하면 됨
class KobertTrainer(Trainer):
    
    # @Override
    def create_optimizer(self):
        optimizer_cls, optimizer_kwargs = self.get_optimizer_cls_and_kwargs(self.args, self.model)
        self.optimizer = AdamW([
            {'params': self.model.bert.parameters()},
            {'params': self.model.classifier.parameters(), 'lr': optimizer_kwargs['lr'] * self.args.LR_CLASSIFIER_MULT}
        ], lr = optimizer_kwargs['lr'])
        
        return self.optimizer

trainer = KobertTrainer(
    model_init(),
    args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    tokenizer=tokenizer_train,
    compute_metrics=compute_metrics,
    callbacks = [EarlyStoppingCallback(early_stopping_patience=2)]
)

doit = trainer.train()



