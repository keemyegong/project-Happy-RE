import React, { useState, useCallback,useEffect, useContext } from "react";
import {universeVariable} from '../../App';
import Cookies from 'js-cookie';
import MicRecorder from 'mic-recorder-to-mp3';
import './aiChat.css'
import axios from "axios";
import ChatCam from '../../components/ai-chat/ChatCam'
import ChatBox from '../../components/ai-chat/ChatBox'

const AIChat = () => {
  const [userInputs,setUserInputs] = useState([]);
  const [chatbotResponses,setChatbotResponses] = useState([]);
  const universal = useContext(universeVariable);
  const [number, setNumber] = useState(0);
  const [userInputText, setUserInputText ] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');
  const recorder = new MicRecorder({
    bitRate: 128
  });

  // 들어가자마자 챗봇한테 처음 인삿말 받아오는 코드 - 개발중엔 꺼둘예정
  // useEffect(()=>{
  //   axios.post(
  //     `${universal.fastUrl}/ai-api/chatbot/`,
  //     {user_input:'안녕하세요'},
  //     {headers: {
  //       Authorization : `Bearer ${Cookies.get('Authorization')}`,
  //       withCredentials: true,
  //     }}
  //     ).then((Response)=>{
  //       setChatbotResponse(Response.data);
  //       const tmpChatbotResponse =[...chatbotResponses];
  //       tmpChatbotResponse.push(Response.data);
  //       setChatbotResponses(tmpChatbotResponse);
  //     })
  // },[])

  // mp3 파일 제작용 레코드(녹음시작)
  const newRecord = ()=>{
    recorder.start().then(() => {
    // something else
  }).catch((e) => {
    console.error(e);
  });
  }

  // mp3 파일 제작용 레코드(정지)
  const newRecordStop = ()=>{
    recorder
    .stop()
    .getMp3().
    then(([buffer, blob]) => {
      // do what ever you want with buffer and blob
      // Example: Create a mp3 file and play
      const file = new File(buffer, `record-${number}.mp3`, {
        type: blob.type,
        lastModified: Date.now()
      });
      setNumber(number+1);

      // 녹음이 잘 되었는지 바로 확인해볼 수 있는 코드, 실제 서비스에선 지울 예정
      const player = new Audio(URL.createObjectURL(file));
      player.play();

      const formData = new FormData();
      formData.append('file',file);
      axios.post(
        `${universal.fastUrl}/fastapi/`,
        formData,
        {headers: {
          'Content-Type': 'audio/mpeg',
          Authorization : `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }}).then((Response)=>{
          console.log(Response.data.text);
          setUserInputText(Response.data.text);
          const tmpUserInputs =[...userInputs];
          tmpUserInputs.push(Response.data.text);
          setUserInputs(tmpUserInputs);

          axios.post(
          `${universal.fastUrl}/ai-api/chatbot/`,
          {user_input:userInputText},
          {headers: {
            Authorization : `Bearer ${Cookies.get('Authorization')}`,
            withCredentials: true,
          }}
          ).then((Response)=>{
            console.log(Response.data);
            setChatbotResponse(Response.data);
            const tmpChatbotResponse =[...chatbotResponses];
            tmpChatbotResponse.push(Response.data);
            setChatbotResponses(tmpChatbotResponse);
          })

        })
        .catch((err)=>{
          console.log(err);
        })
      })
    }

  return (
    <div className='AIChat'>
      {/* 테스트용 컨테이너. */}
      <div className="ai-chat-container">
        <h1 className="text-white">{number}</h1>
        <button onClick={newRecord}>녹음 시작</button>
        <button onClick={newRecordStop}>녹음 끝 + 전송</button>
        <p className="text-white">
          {userInputs}
          ----
          {chatbotResponses}
        </p>
      </div>


      <div className='ai-chat-container'>
        <ChatCam />
        <ChatBox />
      </div>
    </div>
  );
};

export default AIChat;

