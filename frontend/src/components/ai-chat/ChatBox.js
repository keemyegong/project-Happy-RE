import React from 'react';
import './ChatBox.css';
import Button from '../Button/Button';
import AIResponse from './AIResponse';
import UserResponse from './UserResponse';
import ChatEvent from './ChatEvent';

const ChatBox = ({ chatHistory, onSendClick, isMicMuted, toggleMic, userInput, setUserInput, eventProceeding, eventStoping, eventEnd ,isButtondisabled }) => {
  const ChatType = 1;

  const getChatData = (type) => {
    switch (type) {
      case 1:
        return {
          imageSrc: require(`../../assets/characters/default.png`),
          titleName: '해피리',
          titleType: '기본 해파리'
        };
      case 2:
        return {
          imageSrc: require(`../../assets/characters/art.png`),
          titleName: '셰익스피어',
          titleType: '셰익스피어 해파리'
        };
      case 3:
        return {
          imageSrc: require(`../../assets/characters/butler.png`),
          titleName: '집사',
          titleType: '집사 해파리'
        };
      case 4:
        return {
          imageSrc: require(`../../assets/characters/soldier.png`),
          titleName: '장군',
          titleType: '장군 해파리'
        };
      case 5:
        return {
          imageSrc: require(`../../assets/characters/steel.png`),
          titleName: '철학자',
          titleType: '철학자 해파리'
        };
      default:
        return {};
    }
  };

  const chatData = getChatData(ChatType);

  return (
    <div className='container chat-box-container'>
      <div className='row chat-box-title-container'>
        <div className='col-3 chat-title-profile'>
          <img className='chat-title-profile-img' src={chatData.imageSrc} alt={chatData.titleType} />
        </div>
        <div className='col-6'>
          <p className='chat-title-name'>{chatData.titleName}</p>
          <p className='chat-title-type'>{chatData.titleType}</p>
        </div>
        <div className='col-3 chat-quit'>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </div>
        <hr className="chat-box-title-border border-light border-1" />
      </div>

      <div className='chat-box-content-container'>
        {[...chatHistory].reverse().map((chat, index) => {
          if (chat.type === 'user'){
            return <UserResponse key={index} content={chat.content} />
          } else if (chat.type === 'event') {
            console.log("aa");
            return <ChatEvent key={index} content={chat.content} eventStoping={eventStoping} eventProceeding={eventProceeding} eventEnd={eventEnd}/>
          } else{
            return <AIResponse key={index} content={chat.content} />
          }
        })}
      </div>

      <div className='row chat-box-footer-container'>
        <hr className="chat-box-title-border border-light border-1" />
        <div className='row chat-box-footer'>
          <div className='col-10 p-0 position-relative'>
            <input
              type="text"
              className='chat-box-footer-input form-control'
              value={isMicMuted ? userInput : 'recording now'}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={!isMicMuted}
            />
            <span className='mic-icon' onClick={toggleMic}>
              {isMicMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-mute" viewBox="0 0 16 16">
                  <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm4.732 3.732-.001-.001-.718-.719-.001-.001-.703-.702-.001-.001L3.68 2.68l-.001-.001-.703-.703L2.273.268 2.268.273l-.708-.708.707-.707 12 12-.707.707zM11 8v-.879l-1-1V8a3 3 0 0 1-.056.557l1.118 1.118A3.98 3.98 0 0 0 11 8zM5 8a3 3 0 0 0 4.486 2.607l-.748-.748A2 2 0 0 1 6 8V6.121l-1-1V8z" />
                  <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
                  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z" />
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5h.5z" />
                </svg>
              )}
            </span>
          </div>
          <div className='chat-box-send-btn col-2 p-0'>
            <Button disabled={isButtondisabled} className='btn light-btn middle m-2' content='SEND' onClick={onSendClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
