import os
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Body, Request
from typing import List
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .Chatbot import Chatbot
from packages.dependencies import decode_jwt
from models import ChatRequest
import httpx
from pprint import pprint
from .HappyreKoBert import HappyreKoBert

# ----------------------------전역 변수-------------------------------
router = APIRouter()
load_dotenv()
api_key = os.environ.get('OPENAI_API_KEY')  # OPEN AI 키

user_session = {}

user_emotion_russel = {}

user_message = {}

KOBERT_CHECKPOINT_Y = os.environ.get('KOBERT_CHECKPOINT_Y')
kobert_y = HappyreKoBert(KOBERT_CHECKPOINT_Y)

# 현재 경로와 BASE_DIR 경로
current_dir = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(current_dir, ".."))

SPRING_MESSAGE_POST_URL=os.getenv("SPRING_MESSAGE_POST")

# -------------------------------사용자 정의 함수-------------------------------

def emotion_analysis(text : str):
    '''
    텍스트 감정 추출 함수
    현재 Y만 작동
    '''
    return (1,kobert_y(text))

def emotion_tagging(user_id: str, text: str):
    '''
    user_emotion_russel 딕셔너리에 문장과 추출된 러셀 감정 좌표를 매칭
    '''
    if user_id not in user_emotion_russel:
        user_emotion_russel[user_id] = {}
    user_emotion_russel[user_id][text] = emotion_analysis(text)


def message_session_update(user_id:str, text:str, speaker:str, audio:str="None"):
    '''
    유저의 메세지 세션에 유저의 대화와 챗봇의 대화를 업데이트
    '''
    if user_id not in user_message:
        user_message[user_id] = []
    user_message[user_id].append({
        "text":text,
        "speaker":speaker,
        "audio":audio
    })
    
# ----------------------------------라우팅 함수--------------------------------------------
    
# Get 요청 테스트 용 함수
@router.get('/test')
def test(user_id:str=Depends(decode_jwt)):
    
    return user_message

# post 요청 테스트 용 함수
@router.post('/test')
async def post_test(request:Request):
    # token = request.headers["authorization"].split(' ')[-1]
    # result = decode_jwt(token)
    body = await request.json()
    print(body)
    return body

# POST 요청으로 chabot 사용
# chatbot 처리와 함께 딕셔너리 형태로 감정 저장
@router.post('/')
def chatbot(request: ChatRequest, user_id: str = Depends(decode_jwt)):
    '''
    유저의 챗봇 세션이 없는 경우 챗봇 세션 생성
    들어온 텍스트를 OpenAI에 보내고 유저 메세지 세션 업데이트
    응답온 텍스트를 메세지 세션에 업데이트하고 반환
    '''
    # print('post 요청')
    if user_id not in user_session:
        user_session[user_id] = Chatbot(api_key)
    print(user_id)
        
    api_instance = user_session[user_id]
    user_input = request.user_input
    audio = request.audio
    
    message_session_update(user_id, user_input, "user", audio)
    
    response = api_instance.generateResponse(user_input)
    json_item_data = jsonable_encoder(response)
    
    message_session_update(user_id, json_item_data, "ai", "Null")
    
    emotion_tagging(user_id, user_input)
    
    print(f"response : {json_item_data}")
    print("---------------------------------------")
    print(f"user session: {user_session}")
    print("---------------------------------------")
    print(f"user_emotion_russel: {user_emotion_russel}")
    print("---------------------------------------")
    pprint(f"message_session: {user_message}")
    return JSONResponse(content=json_item_data, status_code=200)


@router.post("/post_message")
async def post_message_request(request:Request):
    '''
    Spring 서버로 메세지 세션 저장 요청
    
    '''
    print("메세지 포스트 시작")
    
    header = request.headers["authorization"]
    token = header.split(" ")[-1]
    user_id = decode_jwt(token)
    
    try:
        for idx in range(len(user_message[user_id])):
            message = {
                "diaryId":1,
                "sequence": idx+1,
                "content":user_message[user_id][idx]["text"],
                "speaker":user_message[user_id][idx]["speaker"],
                "audioKey":user_message[user_id][idx]["audio"]            
            }
            headers = {
                "Authorization" : f"Bearer {token}",
                "Content-Type": "application/json"
            }
            try:
                print("츄라이")
                # client = httpx.AsyncClient()
                # async with httpx.AsyncClient() as client:
                #     print("됨?")
                #     # jwt 토큰 같이 보내줘야함 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                #     await client.post(SPRING_MESSAGE_POST, json=message)
                # print("킅")
                response = requests.post(SPRING_MESSAGE_POST_URL, json=message, headers=headers)
                print(response.json())
            except Exception as e:
                print(e)
                raise HTTPException(status_code=500, detail=str(e))
        print("메시지 포스트 종료")
        
    except KeyError as e:
        raise HTTPException(status_code=500, detail="Could not find logs")
    del user_message[user_id]
    print("유저 섹션 삭제")
# 세션에서 삭제
@router.delete('/session')
async def session_delete(user_id: str=Depends(decode_jwt)):
            
    if user_id in user_session:
        del user_session[user_id]
        print('삭제됨')
    
    if user_id in user_emotion_russel:
        del user_emotion_russel[user_id]
        print('user_emotion_russel deleted')

    
    # print(user_emotion_russel)
    # print(user_session)
    # return uuid_dict
    return JSONResponse(content="session deleted",status_code=200)


