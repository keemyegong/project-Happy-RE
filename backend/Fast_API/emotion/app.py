import os
from dotenv import load_dotenv
from models import TextData
from fastapi import APIRouter, File, UploadFile, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from packages.dependencies import decode_jwt


load_dotenv()   

router = APIRouter()

@router.get('/')
def test(user_id:str = Depends(decode_jwt)):
    return({'user_id':user_id})

@router.post('/')
def upload_audio(user_id:str=Depends(decode_jwt), file:UploadFile = File(...)):
    print('Audio 데이터 들어옴')
    print(user_id)
    AUDIO_FOLDER = f"./audio/{user_id}"
    if not os.path.exists(AUDIO_FOLDER):
        os.makedirs(AUDIO_FOLDER)
        print('폴더 생성됨')

    file_location = os.path.join(AUDIO_FOLDER, file.filename)
    with open(file_location, 'wb') as buffer:
        buffer.write(file.file.read())
    return {"result" : "올라갔냐"}