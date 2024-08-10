import React, { useState, useContext } from 'react';
import './MessageCard.css';
import { universeVariable } from '../../App';

import artist from '../../assets/characters/art.png';
import butler from '../../assets/characters/butler.png';
import defaultPersona from '../../assets/characters/default.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';

import axios from 'axios';
import Cookies from 'js-cookie';
import userProfileImage from '../../assets/sampleUserImage.jpg';
import KeywordCard from '../diary-report/KeywordCard';

const MessageCard = ({ messageId, persona, userName, content, keyword, archived, deleteArchived, className }) => {
  const universal = useContext(universeVariable);
  const [favorite, setFavorite] = useState(archived);
  const happyrePersnonaName = ["해피리", "해파린 장군", "해파스찬", "해파라테스", "셰익스피리"];
  const happyRelist = [defaultPersona, soldier, butler, steel, artist];

  const addArchive = () => {
    axios
      .post(
        `${universal.defaultUrl}/api/usermsg/archive/${messageId.toString()}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` } }
      )
      .then((Response) => {
        console.log('successfully archive');
        setFavorite(true);
      })
  }

  const delteArchive = () => {
    axios
      .delete(
        `${universal.defaultUrl}/api/usermsg/archive/${messageId}`,
        { headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` } }
      )
      .then((Response) => {
        console.log('successfully unarchive');
        setFavorite(false);
        if (deleteArchived != undefined) {
          deleteArchived(messageId);
        }
      })
  }

  const handleFavoriteClick = () => {
    if (archived) {
      deleteArchived(messageId);
    }
    else if (favorite) {
      delteArchive();
    } else {
      addArchive();
    }
  };

  return (
    <div className={`message-card ${className}`}>
      <div className="message-card-header">
        <img src={happyRelist[persona]} alt={happyrePersnonaName[persona]} className="profile-image" />
        <div className="user-info">
          <h3 className="user-name">{happyrePersnonaName[persona]}</h3>
          <button className={`favorite-button ${archived || favorite ? 'favorite' : ''}`} onClick={handleFavoriteClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" fill="currentColor" className={`bi bi-star-fill click-star ${favorite ? 'filled' : ''}`} viewBox="0 0 21 22">
              <path d="M7.11642 2.97649C8.14299 -0.35375 12.857 -0.35375 13.8836 2.97649C14.3413 4.46125 15.7283 5.47417 17.2821 5.47417C20.7653 5.47417 22.3243 9.89313 19.5588 12.011L19.2566 12.2424C18.0329 13.1796 17.5219 14.7794 17.976 16.2524L18.1322 16.7592C19.1404 20.03 15.3542 22.6657 12.6368 20.5848C11.3759 19.6191 9.62409 19.6191 8.36317 20.5848C5.64582 22.6657 1.85956 20.03 2.8678 16.7592L3.02404 16.2524C3.47808 14.7794 2.96715 13.1796 1.74345 12.2424L1.44122 12.011C-1.32427 9.89313 0.23467 5.47417 3.71795 5.47417C5.27165 5.47417 6.65873 4.46125 7.11642 2.97649Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="message-card-content">
        <p className="message-card-text">{content}</p>
      </div>

      {/* 메시지 카드에 담긴 키워드 */}
      <div className='message-card-keyword-content'>
        {keyword != undefined && <KeywordCard props={keyword.keywordEntity} emotiontags={keyword.keywordEntity.keywordEmotionEntityList} />}
      </div>
    </div>
  );
};

export default MessageCard;
