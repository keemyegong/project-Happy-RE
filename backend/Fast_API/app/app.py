import os
import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException,UploadFile, File
from fastapi.responses import JSONResponse
from packages.dependencies import decode_jwt
from .SpeechRecognition import ClovaSpeechClient

router = APIRouter()
load_dotenv()
api_key = os.environ.get('OPENAI_API_KEY')  # OPEN AI 키

user_session = {}

current_dir = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(current_dir, '..'))

# 테스트 용
@router.get('/')
def test():
    return {'cur':current_dir, 'base':BASE_DIR}


# clova API 사용
@router.post('/')
async def upload_file(user_id:str=Depends(decode_jwt), file: UploadFile = File(...)):
    AUDIO_FOLDER = f"{BASE_DIR}\\audio\\{user_id}"
    print("요청 들어왔슈")
    # 해당 유저의 폴더가 없는 경우 폴더 생성
    if not os.path.exists(AUDIO_FOLDER):
        os.makedirs(AUDIO_FOLDER)
        print('폴더 생성됨')

    # 파일 경로 설정
    file_location = os.path.join(AUDIO_FOLDER, file.filename)
    with open(file_location, 'wb') as buffer:
        buffer.write(file.file.read())
    
    response = await speech_to_text(file_location=file_location)
    result = {'text':response}
    print(result)
    return JSONResponse(result)

@router.post('/clova')
async def speech_to_text(file_location : str):
    print('클로바로 들어왓슈')
    try:
        response = ClovaSpeechClient().req_upload(file=file_location, completion='sync').json()['text']
    except KeyError as e:
        return 'Key Error'
    
    return response