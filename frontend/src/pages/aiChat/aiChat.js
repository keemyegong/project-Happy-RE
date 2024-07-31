import React, { useState, useEffect, useContext } from "react";
import { universeVariable } from '../../App';
import Cookies from 'js-cookie';
import MicRecorder from 'mic-recorder-to-mp3';
import './aiChat.css';
import axios from "axios";
import ChatCam from '../../components/ai-chat/ChatCam';
import ChatBox from '../../components/ai-chat/ChatBox';

const AIChat = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const universal = useContext(universeVariable);
  const [number, setNumber] = useState(0);
  const [recorder] = useState(new MicRecorder({ bitRate: 128 }));
  const [isRecording, setIsRecording] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [userInput, setUserInput] = useState('');

  // 처음 인삿말 받아오기
  useEffect(() => {
    axios.post(
      `${universal.fastUrl}/ai-api/chatbot/`,
      { user_input: '안녕하세요' },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }
    ).then((response) => {
      const initialMessage = response.data;
      setChatHistory([{ type: 'ai', content: initialMessage }]);
    }).catch((error) => {
      console.error("Error fetching initial message: ", error);
    });
  }, [universal.fastUrl]);

  // 현재 시간을 문자열로 반환하는 함수
  const getCurrentTimeString = () => {
    const now = new Date();
    return `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}_${String(now.getMinutes()).padStart(2, '0')}_${String(now.getSeconds()).padStart(2, '0')}`;
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
      const fileName = `record-${getCurrentTimeString()}.mp3`;
      const file = new File(buffer, fileName, {
        type: blob.type,
        lastModified: Date.now()
      });
      setNumber(number + 1);
      setIsRecording(false);

      // 녹음된 파일 재생 (테스트용)
      const player = new Audio(URL.createObjectURL(file));
      player.play();

      const formData = new FormData();
      formData.append('file', file);

      axios.post(
        `${universal.fastUrl}/fastapi/`,
        formData,
        {
          headers: {
            'Content-Type': 'audio/mpeg',
            Authorization: `Bearer ${Cookies.get('Authorization')}`,
            withCredentials: true,
          }
        }
      ).then((response) => {
        const recognizedText = response.data.text;
        setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'user', content: recognizedText }]);

        axios.post(
          `${universal.fastUrl}/ai-api/chatbot/`,
          { user_input: recognizedText },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('Authorization')}`,
              withCredentials: true,
            }
          }
        ).then((response) => {
          const chatbotReply = response.data;
          setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: chatbotReply }]);
          startRecording(); // 녹음 재시작
        }).catch((error) => {
          console.error("Error fetching chatbot response: ", error);
          startRecording(); // 녹음 재시작
        });

      }).catch((error) => {
        console.error("Error recognizing speech: ", error);
        startRecording(); // 녹음 재시작
      });
    }).catch((error) => {
      console.error("Error stopping recorder: ", error);
      startRecording(); // 녹음 재시작
    });
  };

  // 텍스트 전송
  const sendText = () => {
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'user', content: userInput }]);
    
    axios.post(
      `${universal.fastUrl}/ai-api/chatbot/`,
      { user_input: userInput },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }
    ).then((response) => {
      const chatbotReply = response.data;
      setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: chatbotReply }]);
    }).catch((error) => {
      console.error("Error fetching chatbot response: ", error);
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

  const toggleMic = () => {
    if (isMicMuted) {
      startRecording();
    } else {
      setIsRecording(false);
    }
    setIsMicMuted(!isMicMuted);
  };

  return (
    <div className='AIChat'>
      <div className='container ai-chat-container'>
        <div className='row ai-chat-components'>
          <div className='offset-1 col-4 ai-chat-cam'>
            <ChatCam />
          </div>
          <div className='offset-1 col-6 ai-chat-box'>
            <ChatBox
              chatHistory={chatHistory}
              onSendClick={handleSendClick}
              isMicMuted={isMicMuted}
              toggleMic={toggleMic}
              userInput={userInput}
              setUserInput={setUserInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
