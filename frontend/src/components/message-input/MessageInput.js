import React from 'react';
import './MessageInput.css';
import Button from '../Button/Button';

const MessageInput = () => {
  return (
    <div className="message-input">
      <h2 className="title">
        해피리 친구들에게 <br />
        <strong>오늘 하루</strong>를 공유해 볼까요?
      </h2>
      <hr className="divider" />
      <div className="input-section">
        <textarea className="text-input" placeholder="Write your message here..."></textarea>
        <Button className="btn keyword-btn" content="키워드 가져오기" onClick={() => {}} />
      </div>
      <hr className="divider" />
      <Button
              className="btn dark-btn middle"
              content="Share"
              onClick={() => {
              }}
            />
    </div>
  );
};

export default MessageInput;
