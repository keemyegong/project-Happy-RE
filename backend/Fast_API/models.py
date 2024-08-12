from pydantic import BaseModel

class TextData(BaseModel):
    text : str
    
class ChatRequest(BaseModel):
    user_input: str
    audio : str 
    request: str

class TestMod(BaseModel):
    text:str