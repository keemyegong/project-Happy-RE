import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException,UploadFile, File, Body, Request
from fastapi.responses import JSONResponse
from packages.dependencies import decode_jwt
from .SpeechRecognition import ClovaSpeechClient
import uuid
import boto3
import boto3.exceptions
from botocore.exceptions import ClientError
from typing import List

# ---------------------------------------------전역 변수---------------------------------------------

router = APIRouter()
load_dotenv()
api_key = os.environ.get('OPENAI_API_KEY')  # OPEN AI 키


current_dir = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(current_dir, '..'))

# Amazon S3 클라이언트
s3_client = boto3.client(
    "s3",
    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name = os.getenv("AWS_REGION")
)

BUCKET_NAME = os.getenv("S3_BUCKET")

#----------------------------------------------사용자 정의 함수--------------------------------------------------------

# 음성 데이터 텍스트 변환
async def clova(file_location : str):
    '''
    Clova API를 이용하여 음성 파일을 텍스트로 변환
    파일 경로를 인자로 받음
    '''
    print('Clova start')
    try:
        response = ClovaSpeechClient().req_upload(file=file_location, completion='sync').json()["text"]
        if not response:
            return "Recognition Failed"
    except KeyError as e:
        print(f"Clova Error : {str(e)}")
        return 'Recognition Failed'
    print(f"Clova End")
    return response

# 파일 업로드
async def file_upload(user_id:str, AUDIO_DIR:str):
    '''
    Amazon s3 서버로 오디오 파일을 업로드
    s3에 유저의 폴더가 없으면 유저 폴더 생성
    '''
    print("File Upload Start")
    try:
        user_audio_dir = os.path.abspath(os.path.join(AUDIO_DIR, str(user_id)))
        print(f"user_audio_dir : {user_audio_dir}")
        for root, dirs, files in os.walk(user_audio_dir):
            for filename in files:
                
                local_path = os.path.join(root, filename)
                absolute_path = os.path.abspath(local_path)

                try:
                    with open(absolute_path, 'rb') as file:
                        s3_client.upload_fileobj(file, BUCKET_NAME, filename)

                except s3_client.exceptions.S3UploadFailedError as e:
                    print(f"File upload Error : {str(e)}")
                    raise HTTPException(status_code=500, detail=f"Could not upload file: {e}")
        print("File Upload End")
    except KeyError as ke:
        print(f"Key Error in File Upload : {str(e)}")
        raise HTTPException(status_code=500, detail="Could not find user audio directory")
    
# -----------------------------------------------라우팅 함수----------------------------------------------------------

# clova API 사용
@router.post('/')
async def speech_to_text(user_id:str=Depends(decode_jwt), file: UploadFile = File(...)):
    '''
    요청이 들어온 파일을 로컬에 업로드 하고,
    텍스트로 변환하여 반환
    '''
    print(f"Speech to Text Start")
    AUDIO_DIR = os.path.abspath(os.path.join(BASE_DIR,"audio",str(user_id)))

    # 해당 유저의 폴더가 없는 경우 폴더 생성
    if not os.path.exists(AUDIO_DIR):
        os.makedirs(AUDIO_DIR)
        print('폴더 생성됨')
    
    file_extension = file.filename.split('.')[-1]
    
    uuid_file = f"{uuid.uuid4()}.{file_extension}"

    # 파일 경로 설정
    file_location = os.path.join(AUDIO_DIR, uuid_file)
    with open(file_location, 'wb') as buffer:
        buffer.write(file.file.read())
    
    response = await clova(file_location=file_location)
    print(f"response : {response}")
    result = {
        "text":response,
        "audio":uuid_file
        }
    print("Speech to Text End")
    return JSONResponse(result)

@router.post("/s3_upload")
async def s3_upload(user_id: str=Depends(decode_jwt)):
    '''
    로컬 유저 폴더의 모든 오디오 파일을 Amazon s3에 업로드
    '''

    AUDIO_DIR = os.path.abspath(os.path.join(BASE_DIR, "audio"))
    print("--------------------------------------------------------파일 업로드 시작 -----------------------------------------------------------")
    
    # S3 파일 업로드 로직
    try:
        await file_upload(user_id, AUDIO_DIR)
    except Exception as e:
        print(f"Error Occured in 'file upload' : {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    print("-------------------------------------------------------업로드 완료--------------------------------------------------------")
    return JSONResponse(content="File uploaded", status_code=200)

