import os
import jwt
from dotenv import load_dotenv
from models import TextData, ChatRequest
from fastapi import APIRouter, Depends, HTTPException,UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .Chatbot import Chatbot
from fastapi.security import OAuth2PasswordBearer
from packages.dependencies import decode_jwt
import speech_recognition as sr


router = APIRouter()
load_dotenv()
api_key = os.environ.get('OPENAI_API_KEY')  # OPEN AI 키

user_session = {}

@router.post('/')
async def upload_audio(user_id:str=Depends(decode_jwt), file:UploadFile = File(...)):
    print('Audio 데이터 들어옴')
    AUDIO_FOLDER = f"./audio/{user_id}"
    if not os.path.exists(AUDIO_FOLDER):
        os.makedirs(AUDIO_FOLDER)
        print('폴더 생성됨')

    file_location = os.path.join(AUDIO_FOLDER, file.filename)
    with open(file_location, 'wb') as buffer:
        buffer.write(file.file.read())
    return {"result" : "올라갔냐"}

@router.post('/speech-to-text')
async def speech_to_text(file: UploadFile = File(...)):
    r = sr.Recognizer()
    
    with sr.AudioFile(file.file) as source:
        audio = r.record(source)
    
    google = r.recognize_google(audio, language='ko-KR')

    return {'result':google}