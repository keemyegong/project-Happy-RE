# Happy: Re Porting Manual
이 매뉴얼은 linux 환경에서 Happy: Re를 clone하여 빌드 및 배포하는 방법에 대한 가이드입니다.
# 0. 요구사항
- Ubuntu 20.04.6 LTS
	- Docker version 27.1.1, build 6312585
	- Docker Compose version v2.29.1
	- openjdk 17.0.12 2024-07-16
		- 상세사항
			- OpenJDK Runtime Environment (build 17.0.12+7-Ubuntu-1ubuntu220.04)
			- OpenJDK 64-Bit Server VM (build 17.0.12+7-Ubuntu-1ubuntu220.04, mixed mode, sharing)
# 1. 빌드
Happy: Re git repository 를 clone 후, `git_root/backend/HappyRe` 로 이동하여 실행:
```bash
chmod +x gradlew
./gradlew build
```
# 2. 환경 변수 file 구성
다음 Template를 모두 채운 뒤 git root 폴더에 `.env` 이름으로 배치하세요.
```bash
# .env file

# General environment variables
SERVICE_DOMAIN=# 서비스 도메인 e.g) http://localhost:80

# Security
JWT_SECRET=

# Spring container environment variables
DB_DOMAIN=
DB_CONNECTION=
DB_USERNAME=
DB_PASSWORD=
DOMAIN_PROPERTIES=# Allowed CORS Origin
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# FastAPI container environment variables
OPENAI_API_KEY=
CLOVA_INVOKE_URL=# CLOVA Speech API
CLOVA_SECRET=

#Amazon S3 설정들
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET=

```

# 3. Deploy
git root 에서 실행
```bash
docker compose -f ./docker-compose.yml up down
```
이후 실행
```bash
docker compose -f ./docker-compose.yml up -d
```