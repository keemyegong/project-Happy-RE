import React from 'react';
import './DiaryChat.css';
import UserResponse from '../ai-chat/UserResponse'; 
import AIResponse from '../ai-chat/AIResponse';

const DiaryChat = ({ chatHistory }) => {

    return (
        <div className='container diary-chat-box-container '>
    
          <div className='diary-chat-box-content-container diary-mywords-content'>
            {[...chatHistory].reverse().map((chat, index) => {
              if (chat) {
                if (chat.speaker === 'user') {
                  return <UserResponse key={index} content={chat.content} />
                } else {
                  return <AIResponse key={index} content={chat.content} />
                }
              }
              return null;
            })}
          </div>

        </div>
      );
};

export default DiaryChat;
