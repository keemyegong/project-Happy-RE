from fastapi import FastAPI, Request
from emotion.app import router as emotion_router
from chatbot.app import router as chatbot_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    '*'
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

# custom middleware
@app.middleware("http")
async def JWTFilter(request: Request, call_next):
    #preprocessing
    #execution
    response = await call_next(request)
    #postprocessing
    return response #최종 response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)