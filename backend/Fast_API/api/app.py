import os
import jwt
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
    aws_access_key_id = os.getenv("AWS_ACCEsS_KEY_ID"),
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
    print('클로바로 들어왓슈')
    try:
        response = ClovaSpeechClient().req_upload(file=file_location, completion='sync').json()["text"]
        if not response:
            return "Recognition Failed"
    except KeyError as e:
        print(e)
        return 'Recognition Failed'
    return response

# 파일 업로드
async def file_upload(user_id:str, AUDIO_DIR:str):
    '''
    Amazon s3 서버로 오디오 파일을 업로드
    s3에 유저의 폴더가 없으면 유저 폴더 생성
    '''
    print("파일 업로드 시작")
    user_audio_dir = os.path.join(AUDIO_DIR, str(user_id))
    for root, dirs, files in os.walk(f"{BASE_DIR}\\audio\\{user_id}"):
        print({
            "root":root,
            "dirs": dirs,
            "files": files
        })
        for filename in files:
            # file_unique_name,file_extension = filename.split(".")
            # id = generate_uuid(file_unique_name)
            # temp = f"{id}.{file_extension}"
            # uuid_dict[filename] = temp
            
            local_path = os.path.join(root, filename)
            absolute_path = os.path.abspath(local_path)
            s3_path = os.path.join(f"{user_id}/", os.path.relpath(absolute_path, user_audio_dir))
            
            try:
                with open(absolute_path, 'rb') as file:
                    s3_client.upload_fileobj(file, BUCKET_NAME, s3_path)

            except s3_client.exceptions.S3UploadFailedError as e:
                raise HTTPException(status_code=500, detail=f"Could not upload file: {e}")
    print("파일 업로드 종료")
    
# -----------------------------------------------라우팅 함수----------------------------------------------------------

# 테스트 용
@router.get('/test')
def test():
    return {'cur':current_dir, 'base':BASE_DIR}

@router.post('/test')
def post_test(request:Request):
    token = request.headers["authorization"].split(' ')[-1]
    result = decode_jwt(token)
    return result

# clova API 사용
@router.post('/')
async def speech_to_text(user_id:str=Depends(decode_jwt), file: UploadFile = File(...)):
    '''
    요청이 들어온 파일을 로컬에 업로드 하고,
    텍스트로 변환하여 반환
    '''
    AUDIO_DIR = f"{BASE_DIR}\\audio\\{user_id}"
    print("요청 들어왔슈")
    # 해당 유저의 폴더가 없는 경우 폴더 생성
    if not os.path.exists(AUDIO_DIR):
        os.makedirs(AUDIO_DIR)
        print('폴더 생성됨')
    
    file_extension = file.filename.split('.')[-1]
    
    uuid_file = f"{uuid.uuid4()}.{file_extension}"
    print(file.filename)
    print(uuid_file)

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
    
    print(result)
    return JSONResponse(result)

@router.post("/s3_upload")
async def s3_upload(user_id: str=Depends(decode_jwt)):
    '''
    로컬 유저 폴더의 모든 오디오 파일을 Amazon s3에 업로드
    '''
    AUDIO_DIR = f"{BASE_DIR}\\audio\\"
    print("들어 오긴 했냐")
    
    # S3 파일 업로드 로직
    # s3에 유저 폴더가 있는지 확인
    try:
        s3_response = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f"{user_id}/", MaxKeys=1)
        # 없으면 만들기
        if "Contents" not in s3_response:
            s3_client.put_object(Bucket=BUCKET_NAME, Key=f"{user_id}/")
            print("폴더 생성 완료")
        else:
            print("폴더가 이미 존재")
    
    except s3_client.exception.ClientError as e:
        print("폴더 생성 실패")
        raise HTTPException(status_code=500, detail=f"Could not verify or create folder: {e}")
    
    # 로컬 오디오 폴더에 있는 파일들을 업로드
    file_upload(user_id, AUDIO_DIR)
    return JSONResponse(content="File uploaded", status_code=200)

@router.delete('/s3_delete')
def delete_s3_file(filenames:List[str]=Body(...), user_id:str=Depends(decode_jwt)):
    '''
    Amazon s3에 존재하는 유저 폴더 내의 지정된 파일들을 삭제
    '''
    try:
        for filename in filenames:
            prefix=f"{user_id}/{filename}"
            s3_response = s3_client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=prefix, MaxKeys=1)
            if "Contents" not in s3_response or not any(obj["Key"]==prefix for obj in s3_response["Contents"]):
                raise HTTPException(status_code=500, detail=f"File does not exists in user {user_id}")
            print(filename)
        try:
            s3_client.delete_object(Bucket=BUCKET_NAME, Key=prefix)
            print(f"File {filename} deleted successfully from s3 {user_id} foldeer")
        except ClientError as e:
            print(e)
            raise HTTPException(status_code=500, detail=f"Error occur during deleting file {filename}")
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error occured : {e}")
    return "Delete successful"