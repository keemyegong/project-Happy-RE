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
        <h3>마인드 톡</h3>
        <hr></hr>
        <p className='rtc-modal-header-title'> * 마이크를 필요로 하는 서비스입니다.<br/>
        * 여러분과 대화를 나누는 분들은 여러분처럼 고민을 지니고 있으신 분들이에요. <br/> 대화를 할 때는 상대방을 배려하도록 해요.</p>

 
        <div className="rtc-modal-images my-5">
          <img src={meat} alt="Meat" className="rtc-modal-img" />
          <div className="rtc-modal-arrow">
          </div> {/* 가운데 화살표 추가 */}
          <img src={closed} alt="Closed" className="rtc-modal-img" />
        </div>

        

        <p className='my-5'>움직이기 시작하면 서버에 접속이 됩니다.<br/>
        다른 사람과 가까워지면 음성이 연결되고 멀어지면 연결이 끊어집니다.<br/>
        연결이 끊어진 유저와는 잠시동안 연결이 불가능합니다.   <br/>
        사람이 없으면 새로고침을 통해 방을 바꿀 수 있습니다.</p>   

        {/* <hr/> */}
        <div className="rtc-modal-buttons">
          <div>
            <Button
                  className="rtc-modal-btn btn dark-btn small"
                  content="돌아갈래요"
                  onClick={onCancel} // path = '/profile' 로 돌아가는 함수
                />
          </div>
          <div>
            <Button
                className="rtc-modal-btn btn light-btn small"
                content="시작할래요"
                onClick={onConfirm} // 누르면 show = flase, websocket 연결 되게끔 
              />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RtcModal;
