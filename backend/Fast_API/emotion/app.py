import os
from dotenv import load_dotenv
from models import TextData
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

load_dotenv()   

router = APIRouter()
api_key = os.environ.get('OPEN_API_KEY')

@router.get('/')
def test():
    return({'text':'test'})

@router.post('/')
def emotion_analysis(item: TextData):
    json_item_data = jsonable_encoder(item)
    return JSONResponse(content=json_item_data)