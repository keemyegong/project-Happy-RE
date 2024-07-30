import os
import jwt
from dotenv import load_dotenv
from models import TextData, ChatRequest
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .Chatbot import Chatbot
from fastapi.security import OAuth2PasswordBearer
from packages.dependencies import decode_jwt


router = APIRouter()
load_dotenv()
api_key = os.environ.get('OPENAI_API_KEY')  # OPEN AI 키

user_session = {}


# Get 요청 테스트 용 함수
@router.get('/')
def test(user_id: str=Depends(decode_jwt)):
    print('get 요청 들어옴')
    
    return({'chat':'bot', "user_id": user_id})

# POST 요청으로 chabot 사용
@router.post('/')
async def chatbot(request: ChatRequest, user_id: str = Depends(decode_jwt)):
    # print('post 요청')
    if user_id not in user_session:
        user_session[user_id] = Chatbot(api_key)
    # print(user_id)
        
    api_instance = user_session[user_id]
    user_input = request.user_input
    print(user_input)
    response = api_instance.generateResponse(user_input)
    json_item_data = jsonable_encoder(response)
    # print(user_session)
    print(json_item_data)
    return JSONResponse(content=json_item_data, status_code=200)

# 세션에서 삭제
@router.delete('/')
def session_delete(user_id: str=Depends(decode_jwt)):
    if user_id in user_session:
        del user_session[user_id]
        print('삭제됨')
        print(user_session)
    return JSONResponse(content={'result':'완료'},status_code=200)

