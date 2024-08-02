# 베이스 이미지로 Python 3.9.13 사용
FROM python:3.9.13-slim

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 파일을 작업 디렉토리로 복사
COPY requirementsImg.txt .

# pip 업그레이드
RUN pip install --upgrade pip

# 필요한 Python 패키지 설치
RUN pip install --no-cache-dir -r requirementsImg.txt

# GitHub에서 직접 kobert-tokenizer 설치
RUN pip install git+https://github.com/SKTBrain/KoBERT.git#egg=kobert_tokenizer&subdirectory=kobert_hf
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
# 전체 프로젝트 파일을 작업 디렉토리로 복사
COPY . .

# FastAPI 서버 실행 (uvicorn 사용)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
