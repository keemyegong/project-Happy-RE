import React from 'react';
import './aiChat.css'
import ChatCam from '../../components/ai-chat/ChatCam'
import ChatBox from '../../components/ai-chat/ChatBox'

const AIChat = () => {

  return (
    <div className='AIChat'>
      <div className='ai-chat-container'>
        <ChatCam />
        <ChatBox />
      </div>
    </div>    
  );
};

export default AIChat;
