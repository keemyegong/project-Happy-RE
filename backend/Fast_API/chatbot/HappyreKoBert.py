import sys, io, os
from transformers import BertForSequenceClassification
from kobert_tokenizer import KoBERTTokenizer
from accelerate import Accelerator
import torch

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "KoBertCheckpoint/"))

# Applies Singleton pattern to the class
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

class HappyreKoBert:
    def __init__(self, path):
        LOAD_DIR = os.path.abspath(os.path.join(SAVE_DIR, path))
        print(LOAD_DIR)
        
        self.tokenizer = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1')
        self.model = BertForSequenceClassification.from_pretrained(LOAD_DIR, num_labels=1, ignore_mismatched_sizes=True)
        self.model.eval()
        self.max_len = 512  # Set a max length for the tokenizer

    def __call__(self, inputString):
        inputs = self.tokenizer.encode_plus(
            inputString,
            None,
            add_special_tokens=True,
            max_length=self.max_len,
            padding='max_length',
            return_token_type_ids=True,
            return_attention_mask=True,
            truncation=True
        )
        
        input_ids = torch.tensor(inputs['input_ids']).unsqueeze(0)  # Add batch dimension
        attention_mask = torch.tensor(inputs['attention_mask']).unsqueeze(0)
        token_type_ids = torch.tensor(inputs['token_type_ids']).unsqueeze(0)

        with torch.no_grad():
            outputs = self.model(input_ids, attention_mask=attention_mask, token_type_ids=token_type_ids)
        
        return outputs.logits.item()
