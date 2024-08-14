// src/components/RtcModal.js

import React from 'react';
import './RtcModal.css';
import Button from '../Button/Button'

import meat from '../../assets/images/RtcModalIMG/whenMeat.PNG'
import closed from '../../assets/images/RtcModalIMG/whenClose.PNG'
import wave from '../../assets/images/RtcModalIMG/wave.PNG'


const RtcModal = ({ show, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="rtc-modal-overlay">
      <div className="rtc-modal">
        <p>사람들과 함께 마음속 이야기를 나눠볼까요?</p>
        <p>마이크가 있어야돼요!</p>


        <div className="rtc-modal-images">
          <img src={meat} alt="Meat" className="rtc-modal-img" />
          <div className="rtc-modal-arrow">

            <span>=</span>
            <span>&gt;</span>
          </div> {/* 가운데 화살표 추가 */}
          <img src={closed} alt="Closed" className="rtc-modal-img" />
        </div>


        <p>움직이기 시작하면 서버에 접속이 됩니다!!</p>
        <p>다른사람과 가까워지면 음성 연결이되고 멀어지면 연결이 끊어져</p>
        <p>해당 인원과는 잠시동안 연결이 불가해요</p>       
        <p>사람이 없으면 새로고침을 통해 방을바꿔주세요!</p>   


        <div className="rtc-modal-buttons">
        <Button
              className="message-send-btn btn dark-btn small"
              content="시작"
              onClick={onConfirm} // 누르면 show = flase, websocket 연결 되게끔 
            />
          <Button
              className="message-send-btn btn dark-btn small"
              content="돌아갈래요"
              onClick={onCancel} // path = '/profile' 로 돌아가는 함수
            />
        </div>
      </div>
    </div>
  );
};

export default RtcModal;
