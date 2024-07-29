import os

from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from models import TextData
from packages.dependencies import decode_jwt

from emotion.app import router as emotion_router
from chatbot.app import router as chatbot_router
from app.app import router as app_router

app = FastAPI()

origins = [
    '*'
]

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# jwt_key = os.environ.get("JWT_KEY")
# jwt_algorithm = os.environ.get("JWT_ALGORITHM")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(emotion_router, prefix='/ai-api/emotion')
app.include_router(chatbot_router, prefix="/ai-api/chatbot")
app.include_router(app_router, prefix='/fastapi')

# jwt 디코
# def decode_jwt(token:str):
#     try:
#         payload = jwt.decode(token, jwt_key, algorithms=[jwt_algorithm])
#         user_id: str = payload.get("email")
#         # if user_id is None:
#         #     raise HTTPException(status_code=401, detail="Invalid user ID in token")
#         return user_id
    
#     except jwt.PyJWTError as e:
#         print(e)
#         raise HTTPException(status_code=401, detail="Could not validate credential")

# custom middleware
# http로 들어오는 유저 토큰 확인
@app.middleware("http")
async def JWTFilter(request: Request, call_next):
    token = request.headers.get("Authorization")
    print(token)

    if token and token.startswith("Bearer"):
        token = token[len("Bearer "):]
        try:
            decode_jwt(token)
            # print('decoding 성공')
        except HTTPException as e:
            print(e)
            print("rejected")
            raise HTTPException(status_code=401, detail="Could not validate credential")
            
    #postprocessing
    response = await call_next(request)
    # print(response)
    return response #최종 response

# @app.post('/ai-api')
# async def upload(text: TextData, user_id:str=Depends(decode_jwt)):
#     print(user_id)
#     print('main에서 들어감')
#     text_response = await chatbot_router.url_path_for("chatbot")(text)
#     return text_response

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)