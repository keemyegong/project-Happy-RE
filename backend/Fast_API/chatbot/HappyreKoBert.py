# 실사용 테스트
import sys, io
from transformers import BertForSequenceClassification
from kobert_tokenizer import KoBERTTokenizer
from accelerate import Accelerator
import torch

SAVE_DIR = "./KoBertCheckpoint/"

def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class HappyreKoBert:
    def __init__(self, path):
        self.tokenizer = KoBERTTokenizer.from_pretrained('skt/kobert-base-v1')
        self.model = BertForSequenceClassification.from_pretrained('skt/kobert-base-v1', num_labels=1, ignore_mismatched_sizes=True)
        self.load(path)
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
        
        return outputs.logits.item()  # Assuming single label regression, return the single scalar value
    
    def load(self, path):
        checkpoint = torch.load(path, map_location='cpu')
        self.model.load_state_dict(checkpoint['model_state_dict'])
        
if __name__ == "__main__":
    # Set standard input to handle UTF-8
    sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')
    
    accelerator = Accelerator(cpu=True)
    happyre_kobert = HappyreKoBert(SAVE_DIR + "HappyREKoBERT_y_slice_163923_epoch_12_flag_realnew.pth")

    while True:
        inputString = input("Enter input string (or 'exit' to quit): ")
        if inputString.lower() == 'exit':
            break
        output = happyre_kobert(inputString)
        print(f"Model output: {output}")
