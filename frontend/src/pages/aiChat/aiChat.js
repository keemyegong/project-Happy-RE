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
  const universal = useContext(universeVariable);
  const [number, setNumber] = useState(0);
  const [recorder] = useState(new MicRecorder({ bitRate: 128 }));
  const [isRecording, setIsRecording] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [audioData, setAudioData] = useState('');
  const [isEventDone, setIsEventDone] = useState(false);
  const [isEventStart, setIsEventStart] = useState(false);
  const [isButtondisabled, setIsButtonDisabled] = useState(false);

  // 처음 인삿말 받아오기
  useEffect(() => {

    eventStart();
    setIsButtonDisabled(true);



    axios.post(
      `${universal.fastUrl}/fastapi/chatbot/`,
      { user_input: '안녕하세요', audio: '', request: 'chatbot' },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
          persona:2,
        }
      }
    ).then((response) => {
      const initialMessage = response.data.content;
      setChatHistory([{ type: 'ai', content: initialMessage }]);
    }).catch((error) => {
      console.error("Error fetching initial message: ", error);
    });
  }, [universal.fastUrl]);

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

      // 녹음된 파일 재생 (테스트용)
      const player = new Audio(URL.createObjectURL(file));
      player.play();

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
            persona:2,

          }
        }
      ).then((response) => {
        const { text: recognizedText, audio } = response.data;
        setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'user', content: recognizedText }]);
        setAudioData(audio);
        
        axios.post(
          `${universal.fastUrl}/fastapi/chatbot/`,
          { user_input: recognizedText, audio, request: 'user' },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('Authorization')}`,
              withCredentials: true,
              persona:2,

            }
          }
        ).then((response) => {
          const chatbotReply = response.data.content;
          console.log(response.data)
          setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: chatbotReply }]);
          
          console.log(response.data.trigger)
          if (response.data.trigger && !isEventDone){
            eventStart();
            console.log('aaa');
            setIsEventDone(true);
          }
        }).then(()=>{
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

  // 이벤트 허가 받는 함수
  const eventStart = ()=>{
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '이벤트 허가' }]);
  }

  // 이벤트 허가에서 yes를 누른 경우 실행되는 함수
  const eventProceeding = ()=>{
      // const eventNumber = Math.floor(Math.random() * 4);
      const eventNumber = 1;
  
      if (eventNumber === 0){
        event1();
        setTimeout(()=>{
          eventEnd()
        }, 90000);
      }else if (eventNumber === 1){
        event2();
      }else if (eventNumber === 2){
        event3();
      }else if (eventNumber === 3){
        event4();
      }
  }

  // 이벤트 허가에서 No를 누른 경우 실행되는 함수
  const eventStoping = ()=>{
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: '그렇군요. 그럼 다시 이야기를 해볼까요.' }]);

  }


  // 이벤트 1번 스트레칭
  const event1 = ()=>{
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '스트레칭' }]);

  }
  // 이벤트 2번 명상
  const event2 = ()=>{
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '명상' }]);

  }

  // 이벤트 3번 튀는 공 세기
  const event3 = ()=>{
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '공 세기' }]);
    
  }

  // 이벤트 4번 해파리 누르기
  const event4 = ()=>{
    setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'event', content: '해파리 누르기' }]);
    
  }


  // 이벤트 끝나고 발생하는 함수
  const eventEnd = ()=>{
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

    axios.post(
      `${universal.fastUrl}/fastapi/chatbot/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
          persona:2,

        }
      }
    ).then((response) => {
      const chatbotReply = response.data.content;
      setChatHistory(prevChatHistory => [...prevChatHistory, { type: 'ai', content: chatbotReply }]);
      console.log(response.data.trigger)
      if (response.data.trigger && !isEventDone){
        eventStart();
        console.log('aaa');
        setIsEventDone(true);
      }
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
              eventProceeding={eventProceeding}
              eventStoping={eventStoping}
              isButtondisabled={isButtondisabled} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
