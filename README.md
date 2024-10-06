# Happy: Re - AI 기반 이용자 감정 분석 서비스
🎬 SSAFY 11기 공통 프로젝트 - 웹기술 WebRTC

🥇 프로젝트 1등 최우수상

![Happyre](readme%20resource/Happyre.png)
<br/><br/>

# 목차
1. [기획 배경](#기획-배경)
2. [서비스 소개](#서비스-소개)
8. [빌드 및 배포 가이드](#빌드-및-배포-가이드)
4. [기술 스택](#기술-스택)
6. [서비스 설계](#서비스-설계)
7. [명세서](#명세서)
<br/><br/>

# 기획 배경
## 필요성
- 현대인은 점점 정신 건강의 필요성이 증가하고 있습니다.
- 개인의 심리 상태를 이해하고 관리할 도구가 필요하지만, 시중에 존재하는 일기 및 감정 모니터링 도구들은 여러 단점을 가지고 있습니다.
  - 기록이 번거로워 습관을 들이기 어려움
  - 자가 보고형으로써 객관적인 감정 분석의 요소를 가지지 않음
  - 기록 결과로부터 유의미한 분석을 얻기 힘듦

## 목적

- 바쁜 현대인에게 편리하고 Interactive 한 하루 기록 서비스를 제공합니다.
  - 대화형으로써 작문의 부담이 없습니다.
  - 음성 인식 기능으로 키보드 없이 챗봇과 소통할 수 있습니다.
  - 사용자 맞춤형의 페르소나를 가진 챗봇을 제공합니다.
- 사용자의 텍스트 데이터를 분석하여 **자동으로 감정 상태를 평가**하고, **감정 변화에 중심이 되는 사건 등의 키워드를 제공합니다.**
- 시간에 따른 감정 변화를 모니터링 할 수 있습니다.

## 의의

- 사용자는 자신의 감정을 자각하고 모니터링 할 수 있게 됩니다.
- 자신의 감정을 Triggering 하는 사건이나 단어를 발굴하고
- [자조집단](https://en.wikipedia.org/wiki/Support_group) 의 경험을 형성할 수 있습니다.
  - 비슷한 감정을 가진 익명의 유저들과의 음성 소통
  - 유저의 감정이 담긴 편지를 공유
- **결과적으로 Happy : Re 는 자신을 좀 더 깊게 이해하고, 바람직한 삶의 계획을 세우는 데 도움이 될 수 있습니다.**
<br/><br/>

# 서비스 소개
![](readme%20resource/catchphrase.png)

## 해파리 페르소나 매칭
- Happy: Re 에는 총 5종류의 해파리가 있습니다.

  ![](readme%20resource/persona.png)

- 회원가입 시 간략한 테스트를 통해 알맞은 초기 해파리를 매칭해 줍니다.

  ![](readme%20resource/test.gif)
## 메인 화면

- 메인 화면입니다.

  ![](readme%20resource/profile.gif)

## 다이어리 및 AI 채팅
- 메인 기능으로, 자신과 맞는 해파리와 채팅을 하며 오늘 하루를 정리할 수 있습니다.

  ![](readme%20resource/aichat.gif)

## 유저 메세지 공유
- 오늘 하루의 이야기를 익명으로 공유하고, 다른 사람들의 이야기도 볼 수 있습니다.

  ![](readme%20resource/message.gif)

## 마인드 톡
- 자신과 비슷한 Russell 척도를 가진 익명의 유저들과 음성 채팅으로 서로의 이야기를 나눌 수 있습니다.

  ![](readme%20resource/mindtalk.gif)

## 아카이브
- 마음에 드는 유저 메세지와 키워드를 저장할 수 있습니다.

  ![](readme%20resource/archive.gif)
<br/><br/>

# 빌드 및 배포 가이드
- [Porting manual](exec/Porting%20manual.md) 을 참조하세요.
- 자세한 사용법은 [시연 시나리오](exec/Scenario.md) 를 참조하세요
<br/><br/>

# 기술 스택

## Front-End

- React
- Bootstrap
- WebRTC
  실시간으로 WebSocket 연결 및 WebRTC 연결을 갱신하는 동적인 음성 대화 기능을 구현함

## Back-End

- FastAPI
- SpringBoot
- MySQL
- JPA
- Amazon S3

## AI

- LangChain
- 자체 AI 모델
  - [HuggingFace](https://huggingface.co/) 및 [PyTorch](https://pytorch.org/)를 사용한 감정 인식 모델을 구현하고 Fine-Tuning 하였음
  - 모델은 유저의 발언을 입력으로 받아 [Russell's Model](https://en.wikipedia.org/wiki/Emotion_classification#Circumplex_model) 모델에 대한 감정 예측 X값과 Y값을 출력함
- 데이터셋 및 훈련 방법
  - ![](readme%20resource/data.PNG)
  - 네이버 영화 리뷰 데이터를 수집하고 전처리(긍정도, X축)
  - 대화 데이터셋을 수집하여 전처리(각성도, Y축)
  - 총 약 16만 문장으로 러셀 척도에 대한 예측을 훈련시킴
    - 평균 오차(L1 Loss) 0.13 ~ 0.14
  - Layer-wise learning rate를 적용하여 Catastrophic forgetting을 최소화
    - HuggingFace의 Trainer Class를 상속한 Custom Trainer class로 구현

## 외부 API

[OPENAI API](https://platform.openai.com/)
  - 챗봇 및 요약용 LLM 제공

[CLOVA Speech](https://clova.ai/speech)
  - 음성 인식을 챗봇과의 대화에 활용
<br/><br/>

# 서비스 설계
## 화면 설계서
[Figma link](https://www.figma.com/file/1PJbdnukSAbrktuaonSwqR)
![](readme%20resource/화면%20설계서.PNG)
## Flow chart
[Figma link](https://www.figma.com/file/fAxSiFc3f0PXwAZOsBEGxW)
### 메인 Flow chart
![](readme%20resource/flow_1.PNG)
### AI챗 Flow chart
![](readme%20resource/flow_2.PNG)
## 서비스 시퀀스
### AI 채팅 시퀀스
![](readme%20resource/AI%20채팅%20시퀀스.png)
### 유저 간 채팅 시퀀스
![](readme%20resource/유저%20채팅%20시퀀스.png)
## Architecture
![](readme%20resource/architecture.png)
## ERD
![](readme%20resource/Happyre_ERD.png)
<br/><br/>

# 명세서
## 기능 명세서
![](readme%20resource/기능명세_1.PNG)
![](readme%20resource/기능명세_2.PNG)
## API 명세서
![](readme%20resource/REST_1.PNG)
![](readme%20resource/REST_2.PNG)
![](readme%20resource/REST_3.PNG)
<br/><br/>

# 역할 분담
- 최봉준: 팀장 · PM  · FE 
- 김수민: FE + BE FullStack
- 김예운: FE Leader
- 이동준: BE · AI Main
- 이창현: BE Leader
- 임용구: BE · DB Main