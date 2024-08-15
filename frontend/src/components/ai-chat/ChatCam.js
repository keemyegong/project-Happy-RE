import React, { useState, useEffect, useRef, memo } from 'react';
import './ChatCam.css';

const ChatCam = ({ isCamEnabled, persona }) => {
  const ChatType = Number(persona);

  const getChatData = (type) => {
    switch (type) {
      case 0:
        return {
          imageSrc: require(`../../assets/characters/default.png`),
        };
      case 1:
        return {
          imageSrc: require(`../../assets/characters/soldier.png`),
        };
      case 2:
        return {
          imageSrc: require(`../../assets/characters/butler.png`),
        };
      case 3:
        return {
          imageSrc: require(`../../assets/characters/steel.png`),
        };
      case 4:
        return {
          imageSrc: require(`../../assets/characters/art.png`),
        };
      default:
        return {};
    }
  };

  const chatData = getChatData(ChatType);
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  const day = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  const formattedDate = ``;

  return (
    <div className='ChatCam'>
      <div className='chat-cam-container'>
        <div className='chat-cam-date'>* 새로고침, 뒤로가기 등을 통해 페이지를 이동하는 경우,<br/> 소중한 기록이 없어질 수 있어요.</div>
        <img className='chat-cam-ai-profile-img' src={chatData.imageSrc} alt="AI profile" />
      
      </div>
    </div>
  );
};

export default memo(ChatCam);
