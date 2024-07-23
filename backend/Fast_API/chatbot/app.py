import os
from dotenv import load_dotenv
from models import TextData, ChatRequest
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .Chatbot import Chatbot



router = APIRouter()
load_dotenv()
api_key = os.environ.get('OPEN_API_KEY')

api_instance = Chatbot(api_key)



@router.get('/')
def temp():
    return({'chat':'bot'})

@router.post('/')
async def chatbot(request: ChatRequest):
    print('들어오긴함')
    user_input = request.user_input
    response = api_instance.generateResponse(user_input)
    json_item_data = jsonable_encoder(response)
    return JSONResponse(content=json_item_data, status_code=200)