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
  const recorder = new MicRecorder({ bitRate: 128 });

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
  }, []);

  // 녹음 시작
  const newRecord = () => {
    recorder.start().catch((e) => console.error(e));
  };

  // 녹음 정지 및 전송
  const newRecordStop = () => {
    recorder.stop().getMp3().then(([buffer, blob]) => {
      const file = new File(buffer, `record-${number}.mp3`, {
        type: blob.type,
        lastModified: Date.now()
      });
      setNumber(number + 1);

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
        }).catch((error) => {
          console.error("Error fetching chatbot response: ", error);
        });

      }).catch((error) => {
        console.error("Error recognizing speech: ", error);
      });
    }).catch((error) => {
      console.error("Error stopping recorder: ", error);
    });
  };

  return (
    <div className='AIChat'>
      <div className="ai-chat-container">
        <h1 className="text-white">{number}</h1>
        <button onClick={newRecord}>녹음 시작</button>
      </div>
      <div className='ai-chat-container'>
        <ChatCam />
        <ChatBox chatHistory={chatHistory} onSendClick={newRecordStop} />
      </div>
    </div>
  );
};

export default AIChat;
