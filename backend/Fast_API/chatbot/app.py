import os
import requests
import math
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Body, Request
from typing import List
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from .Chatbot import Chatbot, SummarizeChatbot
from packages.dependencies import decode_jwt
from models import ChatRequest, TestMod
import httpx
from pprint import pprint
from .HappyreKoBert import HappyreKoBert
from .Personas import PERSONAS

# ----------------------------전역 변수-------------------------------
router = APIRouter()
load_dotenv()
api_key = os.environ.get('OPENAI_API_KEY')  # OPEN AI 키

user_session = {}    # 유저 챗봇 세션

user_emotion_russel = {}    # 유저 러셀 좌표 - {유저 : {문장 : 좌표}}

user_message = {}    # 유저 메시지 저장  -  {유저 : [{문장 :"문장", "speaker":"user", "audioKey":"ddd.wav"}]}

KOBERT_CHECKPOINT_X = os.environ.get('KOBERT_CHECKPOINT_X')
KOBERT_CHECKPOINT_Y = os.environ.get('KOBERT_CHECKPOINT_Y')

print(KOBERT_CHECKPOINT_X)
print(KOBERT_CHECKPOINT_Y)

kobert_x = HappyreKoBert(KOBERT_CHECKPOINT_X)
kobert_y = HappyreKoBert(KOBERT_CHECKPOINT_Y)

# 현재 경로와 BASE_DIR 경로
current_dir = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(current_dir, ".."))

SPRING_MESSAGE_POST_URL=os.environ.get("SPRING_MESSAGE_POST_URL")


personas = PERSONAS


# -------------------------------사용자 정의 함수-------------------------------

async def emotion_analysis(text : str):
    return (kobert_x(text), kobert_y(text))

async def emotion_tagging(user_id: str, text: str):
    '''
    user_emotion_russel 딕셔너리에 문장과 추출된 러셀 감정 좌표를 매칭
    
    - user_emotion_russel 구조
    {
    "user_id": {
        "text": "(0,0)"
    }
    '''
    trigger = False
    
    russel_coord = await emotion_analysis(text)
    
    if user_id not in user_emotion_russel:
        user_emotion_russel[user_id] = {}
        
    if russel_coord[0] < -0.8:
        trigger = True
        user_emotion_russel[user_id][text] = russel_coord
    
    return trigger
    
    # user_emotion_russel[user_id].append(tagged_coord)
    
    # print(f"AI test : {user_emotion_russel[user_id][text]}")
    # print(f"user_emotion_russel: {user_emotion_russel}")
    # print("---------------------------------------")
    


def message_session_update(user_id:str, text:str, speaker:str, audio:str="None"):
    '''
    유저의 메세지 세션에 유저의 대화와 챗봇의 대화를 업데이트
    '''
    if user_id not in user_message:
        user_message[user_id] = []
    user_message[user_id].append({
        "content":text,
        "speaker":speaker,
        "audioKey":audio
    })
    
# ----------------------------------라우팅 함수--------------------------------------------
    
# Get 요청 테스트 용 함수
@router.get('/message_test')
async def test(user_id:str=Depends(decode_jwt)):
    
    user_message[user_id] = [
        {
            "content":"test1",
            "speaker":"user",
            "audioKey":"test1.wav"
        },
        {
            "content":"test2",
            "speaker":"user",
            "audioKey":"test2.wav"
        },
        {
            "content":"test3",
            "speaker":"user",
            "audioKey":"test3.wav"
        }
    ]
    
    user_emotion_russel[user_id] = {
        "test1":(0,1),
        "test2":(1,0),
        "test3":(0.5, 0.5)
    }
    
    return user_message

# post 요청 테스트 용 함수
@router.post('/test')
async def post_test(request:Request):
    token = request.headers["authorization"].split(" ")[-1]
    user_id = decode_jwt(token)
    bodies = await request.json()
    user_session[user_id] = bodies
    print(user_session)
    return user_id
# POST 요청으로 chabot 사용
# chatbot 처리와 함께 딕셔너리 형태로 감정 저장
@router.post('/')
async def chatbot(requestforP:Request, request: ChatRequest, user_id: str = Depends(decode_jwt)):
    '''
    유저의 챗봇 세션이 없는 경우 챗봇 세션 생성
    들어온 텍스트를 OpenAI에 보내고 유저 메세지 세션 업데이트
    응답온 텍스트를 메세지 세션에 업데이트하고 반환
    '''
    # print('post 요청')
    
    # front에서 header에 담긴 페르소나 정보 받기
    persona_number = int(requestforP.headers["persona"])
    print(persona_number)
    # persona_number = 2
    
    if user_id not in user_session:
        # Chatbot 생성시에 persona를 선택
        user_session[user_id] = Chatbot(api_key=api_key,persona=personas[persona_number])
    
    print(user_id)
        
    api_instance = user_session[user_id]
    user_input = request.user_input
    audio = request.audio
    if request.request == "user":
        message_session_update(user_id, user_input, "user", audio)
    elif request.request == "chatbot":
        message_session_update(user_id, user_input, "starter", audio)
    
    response = api_instance.generateResponse(user_input)
    # json_item_data = jsonable_encoder(response)
    
    # message_session_update(user_id, json_item_data, "ai", None)
    
    trigger = False
    if request.request == "user":
        trigger = await emotion_tagging(user_id, user_input)
    
    print(f"response : {response}")
    print("---------------------------------------")
    print(f"user session: {user_session}")
    print("---------------------------------------")
    
    pprint(f"message_session: {user_message}")
    
    content = {
        "content":response,
        "trigger":trigger
    }
    
    return JSONResponse(content=content, status_code=200)

# spring 메세지 저장 요청 함수
@router.post("/post_message")
async def post_message_request(request:Request):
    '''
    Spring 서버로 메세지 세션 저장 요청
    
    '''
    print("메세지 포스트 시작")
    
    header = request.headers["authorization"]
    token = header.split(" ")[-1]
    user_id = decode_jwt(token)
    summary_instance = SummarizeChatbot(api_key)
    
    try:
        for idx in range(len(user_message[user_id])):
            data = user_message[user_id][idx]
            russel_coord = user_emotion_russel[user_id]
            if data["speaker"] == "starter":
                continue
            data["sequence"] = idx+1
            data["russelX"] = russel_coord[data["content"]][0]
            data["russelY"] = russel_coord[data["content"]][1]
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=e)
    
    # try:
    #     for idx in range(len(user_message[user_id])):
    #         if user_message[user_id][idx]["speaker"] == "starter":
    #             continue
    #         message = {
    #             "diaryId":1,
    #             "sequence": idx+1,
    #             "content":user_message[user_id][idx]["text"],
    #             "speaker":user_message[user_id][idx]["speaker"],
    #             "audioKey":user_message[user_id][idx]["audio"]            
    #         }
    #         headers = {
    #             "Authorization" : f"Bearer {token}",
    #             "Content-Type": "application/json"
    #         }
    #         print(message)
    #         try:
    #             print("츄라이")
    #             async with httpx.AsyncClient() as client:
    #                 print("됨?")
    #                 response = await client.post(SPRING_MESSAGE_POST_URL, json=message, headers=headers)
    #                 if response.status_code != 200:
    #                     print(f"뭔가 오류남 : {response.json()}")
    #                     raise HTTPException(status_code=500, detail=f"Error: {response.text}")
    #             print(response)
    #             # await requests.post(SPRING_MESSAGE_POST_URL, json=message, headers=headers)
    #             print("하나 드감")
    #         except Exception as e:
    #             print(e)
    #             raise HTTPException(status_code=500, detail=str(e))
    #     print("메시지 포스트 종료")
        
    # except KeyError as e:
    #     raise HTTPException(status_code=500, detail="Could not find logs")
    
    # del user_message[user_id]
    print("유저 섹션 삭제")
    return user_message
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

@router.post("/summarize_russel")
async def summarize_russel(request:Request):
    summary_instance = SummarizeChatbot(api_key)
    token = request.headers["authorization"].split(" ")[-1]
    user_id = decode_jwt(token)
    
    for event in user_emotion_russel[user_id].keys():
        summary = summary_instance.generateResponse(event)
        temp = {
            "text":event,
            "summary":summary,
            "russel":user_emotion_russel[user_id][event]
        }
        print(temp)
        
    
    return