import os
import jwt
from dotenv import load_dotenv
from models import TextData, ChatRequest
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .Chatbot import Chatbot
from fastapi.security import OAuth2PasswordBearer



router = APIRouter()
load_dotenv()
api_key = os.environ.get('OPEN_API_KEY')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# api_instance = Chatbot(api_key)

user_session = {}


def get_current_user(token: str = Depends(oauth2_scheme)):
    key = "secret"  # 시크릿 키
    try:
        payload = jwt.decode(token, key, algorithms=["HS256"])
        user_id : str = payload.get("sub")
        if user_id == None:
            raise HTTPException(status_code=401, detail="Invalid user ID in token")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credential")
    
    

@router.get('/')
def temp():
    print('get 요청 들어옴')
    key='vmfhaltmskdlstkfkdgodyroqkfwkdbalroqkfwkdbalaaaaaaaaaaaaaaaabbbbb'
    encoded = 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InFxcXFxcXFxcXFxcSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjE3OTE4MDIsImV4cCI6MTcyMjAwNzgwMn0._Yc0QvmtaWvZZkbd5z87QnC6VgHGeCh0XzXVsRPyaPQ'
    decoded = jwt.decode(encoded, key, algorithms=["HS256"], options={"verify_signature":True})
    
    return({'chat':'bot', "jwt": decoded})

@router.post('/')
async def chatbot(request: ChatRequest, user_id: str = Depends(get_current_user)):
    print('post 요청')
    if user_id not in user_session:
        user_session[user_id] = Chatbot(api_key)
        
    api_instance = user_session[user_id]
    user_input = request.user_input
    # token = request.token
    response = api_instance.generateResponse(user_input)
    json_item_data = jsonable_encoder(response)
    return JSONResponse(content=json_item_data, status_code=200)