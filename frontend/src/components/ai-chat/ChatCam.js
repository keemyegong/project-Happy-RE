import React, { useState } from 'react';
import './ChatCam.css';
import Button from '../Button/Button';

const ChatCam = () => {
  // 해파리 타입
  const ChatType = 1;
  const UserProfile = '../../assets/characters/default.png'

  // 해파리 데이터 가져오기
  const getChatData = (type) => {
    switch (type) {
      case 1:
        return {
          imageSrc: require(`../../assets/characters/default.png`),
        };
      case 2:
        return {
          imageSrc: require(`../../assets/characters/art.png`),
        };
      case 3:
        return {
          imageSrc: require(`../../assets/characters/butler.png`),
        };
      case 4:
        return {
          imageSrc: require(`../../assets/characters/soldier.png`),
        };
      case 5:
        return {
          imageSrc: require(`../../assets/characters/steel.png`),
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

  const formattedDate = `${year}.${month}.${date}.${day}`;

  return (
    <div className='ChatCam'>
      <div className='chat-cam-date'>{formattedDate}</div>
      <div className='chat-cam-container'>
        <img className='chat-cam-ai-profile-img' src={chatData.imageSrc}/>
      </div>
    </div>
  );
};

export default ChatCam;
