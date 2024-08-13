// src/components/RtcModal.js

import React from 'react';
import './RtcModal.css';
import Button from '../Button/Button'
const RtcModal = ({ show, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="rtc-modal-overlay">
      <div className="rtc-modal">
        <p>사람들과 함께 마음속 이야기를 나눠볼까요?</p>
        <p>마이크가 있어야돼요!</p>
        <div className="rtc-modal-buttons">
        <Button
              className="message-send-btn btn dark-btn small"
              content="시작"
              onClick={onConfirm}
            />
          <Button
              className="message-send-btn btn dark-btn small"
              content="돌아갈래요"
              onClick={onCancel}
            />
        </div>
      </div>
    </div>
  );
};

export default RtcModal;
