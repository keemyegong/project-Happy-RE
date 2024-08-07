import React, { useState, useEffect, useContext } from "react";
import { universeVariable } from '../../App';
import Cookies from 'js-cookie';
import MicRecorder from 'mic-recorder-to-mp3';
import './aiChat.css';
import axios from "axios";
import ChatCam from '../../components/ai-chat/ChatCam';
import ChatBox from '../../components/ai-chat/ChatBox';
import ChatEvent from "../../components/ai-chat/ChatEvent";

const AIChat = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false); // 챗봇 입력 중 상태 추가
  const universal = useContext(universeVariable);
  const [number, setNumber] = useState(0);
  const [recorder] = useState(new MicRecorder({ bitRate: 128 }));
  const [isRecording, setIsRecording] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [audioData, setAudioData] = useState('');
  const [isEventDone, setIsEventDone] = useState(false);
  const [isEventStart, setIsEventStart] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [activeButton, setActiveButton] = useState('type');
  const [isCamEnabled, setIsCamEnabled] = useState(true);
  const [userInputCount, setUserInputCount] = useState(0); // 유저 인풋 카운트 상태 추가

  // 처음 인삿말 받아오기
  useEffect(() => {
    setIsButtonDisabled(true);

    axios.post(
      `${universal.fastUrl}/fastapi/chatbot/`,
      { user_input: '안녕하세요', audio: '', request: 'chatbot' },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
          persona: 2,
        }
      }
    ).then((response) => {
      console.log(response)
      const initialMessage = response.data.content;
      setChatHistory([{ type: 'ai', content: initialMessage }]);
    }).catch((error) => {
      console.error("Error fetching initial message: ", error);
    });
  }, [universal.fastUrl]);

  const endChatSession = () => {
    // 1. 채팅 로그 스프링 저장 요청
    axios.post(`${universal.fastUrl}/fastapi/chatbot/post_message`, {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('Authorization')}`,
        withCredentials: true,
        persona: 2,
      }
    }).then((response) => {
      console.log("Chat log saved:", response.data);
    }).catch((error) => {
      console.error("Error saving chat log:", error);
    });

    // 2. 다이어리 요약 전송 및 세션 삭제 요청
    axios.delete(`${universal.fastUrl}/fastapi/chatbot/`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('Authorization')}`,
        withCredentials: true,
        persona: 2,
      }
    }).then((response) => {
      console.log("Session ended and diary summary sent:", response.data);
    }).catch((error) => {
      console.error("Error ending session:", error);
    });

    // 3. 로컬 오디오 파일 s3 업로드 요청
    axios.post(`${universal.fastUrl}/fastapi/api/s3_upload`, {}, {
      headers: {
        Authorization: `Bearer ${Cookies.get('Authorization')}`,
        withCredentials: true,
        persona: 2,
      }
    }).then((response) => {
      console.log("Audio file uploaded to S3:", response.data);
    }).catch((error) => {
      console.error("Error uploading audio file to S3:", error);
    });
  };

  // 녹음 시작
  const startRecording = () => {
    recorder.start().then(() => {
      setIsRecording(true);
    }).catch((e) => console.error(e));
  };

  // 녹음 정지 및 전송
  const sendRecording = () => {
    if (!isRecording) return;

    recorder.stop().getMp3().then(([buffer, blob]) => {
      const file = new File(buffer, `record-${Date.now()}.mp3`, {
        type: blob.type,
        lastModified: Date.now()
      });
      setNumber(number + 1);
      setIsRecording(false);

      const formData = new FormData();
      formData.append('file', file);

      axios.post(
        `${universal.fastUrl}/fastapi/api/`,
        formData,
        {
          headers: {
            'Content-Type': 'audio/mpeg',
            Authorization: `Bearer ${Cookies.get('Authorization')}`,
            withCredentials: true,
            persona: 2,
          }
        }
      ).then((response) => {
        const { text: recognizedText, audio } = response.data;
        setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'user', content: recognizedText }]);
        setAudioData(audio);

        setIsBotTyping(true); // 챗봇 입력 중 상태로 설정

        axios.post(
          `${universal.fastUrl}/fastapi/chatbot/`,
          { user_input: recognizedText, audio, request: 'user' },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('Authorization')}`,
              withCredentials: true,
              persona: 2,
            }
          }
        ).then((response) => {
          const chatbotReply = response.data.content;
          setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: chatbotReply }]);
          setIsBotTyping(false); // 챗봇 입력 중 상태 해제

          setUserInputCount(prevCount => {
            const newCount = prevCount + 1;
            if (newCount >= 3 && !isEventDone) {
              eventStart();
              setIsEventDone(true);
            }
            return newCount;
          });

        }).then(() => {
          startRecording(); // 녹음 재시작
        }).catch((error) => {
          console.error("Error fetching chatbot response: ", error);
          setIsBotTyping(false); // 챗봇 입력 중 상태 해제
          startRecording(); // 녹음 재시작
        });

      }).catch((error) => {
        console.error("Error recognizing speech: ", error);
        setIsBotTyping(false); // 챗봇 입력 중 상태 해제
        startRecording(); // 녹음 재시작
      });
    }).catch((error) => {
      console.error("Error stopping recorder: ", error);
      startRecording(); // 녹음 재시작
    });
  };

  // 이벤트 허가 받는 함수
  const eventStart = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '이벤트 허가' }]);
  }

  // 이벤트 허가에서 yes를 누른 경우 실행되는 함수
  const eventProceeding = () => {
    const eventNumber = 1;

    if (eventNumber === 0) {
      event1();
      setTimeout(() => {
        eventEnd()
      }, 90000);
    } else if (eventNumber === 1) {
      event2();
    } else if (eventNumber === 2) {
      event3();
    } else if (eventNumber === 3) {
      event4();
    }
  }

  // 이벤트 허가에서 No를 누른 경우 실행되는 함수
  const eventStoping = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: '그렇군요. 그럼 다시 이야기를 해볼까요.' }]);
  }

  // 이벤트 1번 스트레칭
  const event1 = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '스트레칭' }]);
  }

  // 이벤트 2번 명상
  const event2 = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '명상' }]);
  }

  // 이벤트 3번 튀는 공 세기
  const event3 = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '공 세기' }]);
  }

  // 이벤트 4번 해파리 누르기
  const event4 = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '해파리 누르기' }]);
  }

  // 이벤트 끝나고 발생하는 함수
  const eventEnd = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: '기분전환이 좀 되셨을까요? 그럼 다시 이야기해봐요.' }]);
  }

  // 텍스트 전송
  const sendText = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'user', content: userInput }]);

    const payload = {
      user_input: userInput,
      audio: audioData,
      request: 'user'
    };

    setIsBotTyping(true); // 챗봇 입력 중 상태로 설정

    axios.post(
      `${universal.fastUrl}/fastapi/chatbot/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
          persona: 2,
        }
      }
    ).then((response) => {
      const chatbotReply = response.data.content;
      setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: chatbotReply }]);
      setIsBotTyping(false); // 챗봇 입력 중 상태 해제

      setUserInputCount(prevCount => {
        const newCount = prevCount + 1;
        if (newCount >= 3 && !isEventDone) {
          eventStart();
          setIsEventDone(true);
        }
        return newCount;
      });

    }).catch((error) => {
      console.error("Error fetching chatbot response: ", error);
      setIsBotTyping(false); // 챗봇 입력 중 상태 해제
    });

    setUserInput('');
  };

  const handleSendClick = () => {
    if (isMicMuted) {
      sendText();
    } else {
      sendRecording();
    }
  };

  const toggleMic = (mode) => {
    if (mode === 'rec') {
      setIsMicMuted(false);
      startRecording();
    } else {
      setIsMicMuted(true);
      setIsRecording(false);
    }
    setActiveButton(mode); // 클릭된 버튼 상태 업데이트
  };

  const toggleCam = () => {
    setIsCamEnabled(!isCamEnabled);
  };

  return (
    <div className='AIChat'>
      <div className='container ai-chat-container'>
        <div className='row ai-chat-components'>
          <div className='col-6 ai-chat-cam'>
            <ChatCam isCamEnabled={isCamEnabled} />
            <div className='aichat-button-bar'>
              <p className={`aichat-button-bar-type ${activeButton === 'type' ? 'active' : ''}`} onClick={() => toggleMic('type')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-keyboard" viewBox="0 0 16 16">
                  <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                  <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25z"/>
                </svg>
                <span>
                  TYPE
                </span>
              </p>
              <span>
                |
              </span>
              <p className={`aichat-button-bar-type ${activeButton === 'rec' ? 'active' : ''}`} onClick={() => toggleMic('rec')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
                  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
                </svg>
                <span>
                  REC
                </span>
              </p>
              <span>
                |
              </span>
              <p onClick={toggleCam}>
                {isCamEnabled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera-video-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera-video-off-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272zm-10.114-9A2 2 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728zm9.746 11.925-10-14 .814-.58 10 14z"/>
                  </svg>
                )}
                <span>
                  CAM
                </span>
              </p>
            </div>
          </div>
          <div className='col-6 ai-chat-box'>
            <ChatBox
              chatHistory={chatHistory}
              isBotTyping={isBotTyping} // 챗봇 입력 중 상태 전달
              onSendClick={handleSendClick}
              isMicMuted={isMicMuted}
              toggleMic={toggleMic}
              userInput={userInput}
              setUserInput={setUserInput}
              eventProceeding={eventProceeding}
              eventStoping={eventStoping}
              isButtonDisabled={isButtonDisabled}
              endChatSession={endChatSession} // 채팅 종료 함수 전달
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
