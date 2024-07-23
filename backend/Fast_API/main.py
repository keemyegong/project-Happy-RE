from fastapi import FastAPI, Request
from emotion.app import router as emotion_router
from chatbot.app import router as chatbot_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:5500",
    "http://127.0.0.1:5500/",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:8000/ai-api/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(emotion_router, prefix='/ai-api/emotion')
app.include_router(chatbot_router, prefix="/ai-api/chatbot")