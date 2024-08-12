import React, { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import './ChatBox.css';
import Button from '../Button/Button';
import AIResponse from './AIResponse';
import UserResponse from './UserResponse';
import ChatEvent from './ChatEvent';

const ChatBox = ({ setIsInputDisabled, isInputDisabled, setIsButtonDisabled, chatHistory, isBotTyping, onSendClick, isMicMuted, userInput, setUserInput, eventProceeding, eventStoping, eventEnd, isButtonDisabled, endChatSession, persona }) => {


  const ChatType = Number(persona);
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태

  const getChatData = (type) => {
    switch (type) {
      case 0:
        return {
          imageSrc: require('../../assets/characters/default.png'),
          titleName: '해피리',
          titleType: '우리들의 친구 해피리'
        };
      case 1:
        return {
          imageSrc: require('../../assets/characters/soldier.png'),
          titleName: '해파린 장군',
          titleType: '용맹한 장군 해파린'
        };
      case 2:
        return {
          imageSrc: require('../../assets/characters/butler.png'),
          titleName: '해파스찬',
          titleType: '맞춤형 집사 해파스찬'
        };
      case 3:
        return {
          imageSrc: require('../../assets/characters/steel.png'),
          titleName: '해파라테스',
          titleType: '고뇌하는 철학자 해파라테스'
        };
      case 4:
        return {
          imageSrc: require('../../assets/characters/art.png'),
          titleName: '셰익스피리',
          titleType: '예술가의 영혼 셰익스피리'
        };
      default:
        return {};
    }
  };

  const chatData = getChatData(ChatType);

  const handleQuit = () => {
    Swal.fire({
      title: '정말 나가시겠습니까?',
      html: "다이어리는 하루에 한 번만 등록할 수 있어요! <br/> 한번 나가면 오늘의 다이어리는 다시 기록할 수 없습니다......",
      icon: 'warning',
      iconColor: '#D35E5E',
      color: 'white',
      background: '#292929',
      confirmButtonColor: '#4B4E6D',
      showCancelButton: true,
      cancelButtonColor: '#D35E5E',
      confirmButtonText: '나갈래요!',
      cancelButtonText: 'CANCEL'
    }).then((result) => {
      if (result.isConfirmed) {
        endChatSession();
      }
    });
  };


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
        <div className='col-3 chat-quit' onClick={handleQuit}>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </div>
        <hr className="chat-box-title-border border-light border-1" />
      </div>

      <div className='chat-box-content-container'>
        {[...chatHistory, isBotTyping ? { type: 'ai', content:
          <img 
          className='chat-box-typing-animation' 
          src={require('../../assets/images/typing.gif')} 
          alt="AI Typing......" 
        />
      } : null].reverse().map((chat, index) => {
          if (chat) {
            if (chat.type === 'user') {
              return <UserResponse key={index} content={chat.content} />
            } else if (chat.type === 'event') {
              return <ChatEvent key={index} content={chat.content} eventStoping={eventStoping} eventProceeding={eventProceeding} eventEnd={eventEnd} setIsInputDisabled={setIsInputDisabled} />
            } else {
              return <AIResponse key={index} content={chat.content} />
            }
          }
          return null;
        })}
      </div>

      <div className='row chat-box-footer-container'>
        <hr className="chat-box-title-border border-light border-1" />
        <div className='row chat-box-footer'>
          <div className='col-10 p-0 position-relative'>
          <input
              type="text"
              className={`chat-box-footer-input form-control ${!isMicMuted ? 'recording' : ''}`}
              value={isMicMuted ? userInput : 'Enter를 누르거나 SEND 버튼을 누르면 음성이 전송돼요!'}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') onSendClick(); }}
              disabled={!isMicMuted || isInputDisabled}
              placeholder={isInputDisabled && isMicMuted? '이벤트가 진행중이에요...' :'음성 대화를 원하면 REC 버튼을 눌러 주세요!'}
            />
          </div>
          <div className='chat-box-send-btn col-2 p-0'>
            <Button className='btn light-btn middle m-2' content='SEND' onClick={onSendClick} disabled={isMicMuted && !userInput} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
