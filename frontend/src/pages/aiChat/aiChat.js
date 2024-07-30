import React, { useState } from 'react';
import './aiChat.css'
import ChatBox from '../../components/ai-chat/ChatBox'

const AIChat = () => {


  return (
    <div className='AIChat'>
      <div className='ai-chat-container'>
        <ChatBox />
      </div>
    </div>
  );
};

export default AIChat;
