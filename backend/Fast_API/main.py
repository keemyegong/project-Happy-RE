import os

from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from packages.dependencies import decode_jwt

from emotion.app import router as emotion_router
from chatbot.app import router as chatbot_router
from api.app import router as app_router

app = FastAPI()

origins = [
    # '*',
    os.getenv("TEST_LOCAL"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(emotion_router, prefix="/fastapi/emotion")
app.include_router(chatbot_router, prefix="/fastapi/chatbot")
app.include_router(app_router, prefix="/fastapi/api")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# custom middleware
# http로 들어오는 유저 토큰 확인
@app.middleware("http")
async def JWTFilter(request: Request, call_next):
    token = request.headers.get("Authorization")
    # print(f"token : {token}")
    # print(f"BASE_DIR : {BASE_DIR}")
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)