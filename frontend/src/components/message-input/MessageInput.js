import React, { useState, useContext } from 'react';
import './MessageInput.css';
import Button from '../Button/Button';
import axios from 'axios';
import { universeVariable } from '../../App';
import Cookies from 'js-cookie';
import KeywordCard from '../diary-report/KeywordCard';
import Swal from 'sweetalert2';

const MessageInput = ({ keywords }) => {
  const [message, setMessage] = useState('');
  const [keywordId, setKeywordId] = useState(0);
  const [leftdisable, setLeftdisable] = useState(true);
  const [rightdisable, setRightdisable] = useState(false);

  const universal = useContext(universeVariable);
  const goLeftKeyword = () => {
    if (keywordId > 0) {
      setKeywordId(keywordId - 1);
      setRightdisable(false);
      if (keywordId === 1) {
        setLeftdisable(true);
      }
    }
  };
  const goRightKeyword = () => {
    if (keywordId < keywords.length - 1) {
      setKeywordId(keywordId + 1);
      setLeftdisable(false);
      if (keywordId === keywords.length - 2) {
        setRightdisable(true);
      }
    }
  };

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    const data = {
      content: message,
      keywordEntityDTOList: [keywords[keywordId]]
    };

    axios
      .post(
        `${universal.defaultUrl}/api/usermsg`,
        data,
        { headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` } }
      )
      .then((response) => {
        console.log('Message sent successfully:', response.data);
        Swal.fire({
          title: '메시지를 보내는 데 성공했습니다!',
          text: '해피리가 책임지고 다른분들께 전달해드릴게요!',
          icon: "success",
          iconColor: "#4B4E6D",
          color: 'white',
          background: '#292929',
          confirmButtonColor: '#4B4E6D',
        });
        setMessage(''); // Clear the input after sending
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <div className="message-input">
      <h2 className="message-input-title">
        해피리 친구들에게
      </h2>
      <h2 className="message-input-title">
        <strong>오늘 하루</strong>를 공유해 볼까요?
      </h2>
      <hr className="divider" />
      <div className="message-input-section">
        <textarea
          className="text-input"
          placeholder=" 해피리에서는 따뜻한 대화를 나누는 게 중요해요 
            메시지를 보내기 전, 받는 사람의 기분을 한 번 더 생각해 주세요
            공유하고 싶은 오늘의 키워드를 선택할 수 있어요!
            "
          value={message}
          onChange={handleInputChange}
        ></textarea>
        <div className='message-input-keyword'>
          {keywords.length > 0 ? (
            <>
              <button
                onClick={goLeftKeyword}
                disabled={leftdisable}
                className='message-input-keyword-left-btn'
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-compact-left"
                  viewBox="0 0 16 16"
                  style={{
                    cursor: leftdisable ? 'default' : 'pointer',
                    opacity: leftdisable ? 0.5 : 1,
                  }}
                >
                  <path
                    fillRule="evenodd"
                    d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"
                  />
                </svg>
              </button>
              <div className='message-keyword-card'>
                {keywords[keywordId] !== undefined && <KeywordCard props={keywords[keywordId]} />}
              </div>
              <button
                onClick={goRightKeyword}
                disabled={rightdisable}
                className='message-input-keyword-left-btn'
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-compact-left"
                  viewBox="0 0 16 16"
                  style={{
                    cursor: rightdisable ? 'default' : 'pointer',
                    opacity: rightdisable ? 0.5 : 1,
                  }}
                >
                  <path fillRule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671" />
                </svg>
              </button>
            </>
          ) : (
            <p className='message-keyword-none-text'>
              아직 오늘 하루를 기록하지 않으셨네요!
              <br/>
              다이어리를 작성하러 갈까요?</p>
          )}
        </div>
      </div>
      <hr className="divider" />
      <Button
        className="message-send-btn btn middle dark-btn"
        content="Share"
        onClick={handleSendMessage}
      />
    </div>
  );
};

export default MessageInput;
