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

  const formattedDate = `${year}.${month}.${date}.${day}`;

  const [userVideoStream, setUserVideoStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        setUserVideoStream(stream);
      })
      .catch(error => {
        console.error('Error accessing user camera:', error);
      });
  }, []);

  useEffect(() => {
    if (videoRef.current && userVideoStream) {
      videoRef.current.srcObject = userVideoStream;
    }
  }, [userVideoStream]);

  return (
    <div className='ChatCam'>
      <div className='chat-cam-container'>
        <div className='chat-cam-date'>{formattedDate}</div>
        <img className='chat-cam-ai-profile-img' src={chatData.imageSrc} alt="AI profile" />
        {isCamEnabled && userVideoStream ? (
          <video
            className='chat-cam-user-video'
            autoPlay
            muted
            playsInline
            ref={videoRef}
          />
        ) : (
          <img
            className='chat-cam-user-video'
            src={require('../../assets/images/chatcam-user2.gif')}
            alt="User Jellyfish"
          />
        )}
      </div>
    </div>
  );
};

export default memo(ChatCam);
