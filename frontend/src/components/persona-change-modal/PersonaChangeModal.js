// src/components/PersonaChangeModal/PersonaChangeModal.js

import React from 'react';
import Button from '../Button/Button';
import artist from '../../assets/characters/art.png';
import butler from '../../assets/characters/butler.png';
import defaultPersona from '../../assets/characters/default.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';
import './PersonaChangeModal.css';

const PersonaChangeModal = ({ show, handleClose, changePersona }) => {
  const happyRelist = [defaultPersona, soldier, butler, steel, artist];

  if (!show) {
    return null;
  }

  return (
    <div className='modal'>
      <div className='happyre-persona-change-container'>
        <div className='row row-cols-2 row-cols-lg-3 justify-content-center'>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={() => { changePersona(0) }}>
              <img src={happyRelist[0]} className='happyre-choice-preview' />
              <div className='happyre-persona-info'>
                <div className='happyre-persona-info-title'>
                  해피리
                </div>
                <div className='happyre-persona-info-description'>
                  안녕하세요! 해피리예요.
                  오늘은 어떤 일이 있으셨나요? 기분이나 마음이 무거우신가요?
                  <br />
                  제가 도와드릴 수 있는 게 있다면 말씀해 주세요.
                </div>
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={() => { changePersona(1) }}>
              <img src={happyRelist[1]} className='happyre-choice-preview' />
              <div className='happyre-persona-info'>
                <div className='happyre-persona-info-title'>
                  해파린 장군
                </div>
                <div className='happyre-persona-info-description'>
                  안녕하신가, 전사여. 오늘 그대의 마음이 무거운 듯하네. 어떤 고민이 있는지 말해보거라.
                  <br />
                  내가 도울 수 있는 방법을 찾아보겠네.
                </div>
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={() => { changePersona(2) }}>
              <img src={happyRelist[2]} className='happyre-choice-preview' />
              <div className='happyre-persona-info'>
                <div className='happyre-persona-info-title'>
                  해파스찬
                </div>
                <div className='happyre-persona-info-description'>
                  안녕하세요, 주인님!
                  <br />
                  오늘 주인님을 스트레스 받게 한 일은 없었나요?
                  <br />
                  스트레스 관리를 위해 효율적인 방법을 모색해 볼게요.
                </div>
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={() => { changePersona(3) }}>
              <img src={happyRelist[3]} className='happyre-choice-preview' />
              <div className='happyre-persona-info'>
                <div className='happyre-persona-info-title'>
                  해파라테스
                </div>
                <div className='happyre-persona-info-description'>
                  안녕하신가. 오늘 하루는 어떠했나.
                  <br />
                  삶의 의미에 대해 생각하기 좋은 날이었나?
                  <br />
                  어떤 생각들이 그대의 마음을 채우고 있는지 궁금하네.
                </div>
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={() => { changePersona(4) }}>
              <img src={happyRelist[4]} className='happyre-choice-preview' />
              <div className='happyre-persona-info'>
                <div className='happyre-persona-info-title'>
                  셰익스피리
                </div>
                <div className='happyre-persona-info-description'>
                  (깊이 생각하며) 우리의 무대는 삶의 거울이라네.
                  <br />
                  그대의 영혼에 잠든 이야기를 깨워,
                  <br />
                  어떤 상념들이 그대를 사로잡고 있는지 들여다보게나!
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button className='btn light-btn small' content='Close' onClick={handleClose} />
      </div>
    </div>
  );
};

export default PersonaChangeModal;
