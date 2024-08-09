import React, { useState, useContext  } from 'react';
import './MessageCard.css';
import {universeVariable} from '../../App';


import axios from 'axios';
import Cookies from 'js-cookie';
import userProfileImage from '../../assets/sampleUserImage.jpg';
import KeywordCard from '../diary-report/KeywordCard';

const MessageCard = ({ messageId, profileImageUrl, userName, content, keyword }) => {
  const universal = useContext(universeVariable);
  const [favorite, setFavorite] = useState(false);

  const addArchive = ()=>{
    axios
      .post(
        `${universal.defaultUrl}/api/usermsg/archive/${messageId.toString()}`,
        {},
        { headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` } }
      )
      .then((Response)=>{
        console.log('successfully archive');
        setFavorite(true);
      })
  }

  const delteArchive = ()=>{
    axios
    .delete(
      `${universal.defaultUrl}/api/usermsg/archive/${messageId}`,
      { headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` } }
    )
    .then((Response)=>{
      console.log('successfully unarchive');
      setFavorite(false);
    })
  }
  
  const handleFavoriteClick = () => {
    if (favorite){
      delteArchive();
    }else{
      addArchive();
    }

  };

  return (
    <div className="message-card">
      <div className="message-card-header">
        <img src={userProfileImage} alt={userName} className="profile-image" />
        <div className="user-info">
          <h3 className="user-name">{userName}</h3>
          <button className={`favorite-button ${favorite ? 'favorite' : ''}`} onClick={handleFavoriteClick}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className={`bi bi-star-fill click-star ${favorite ? 'filled' : ''}`} viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg> */}
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
        {keyword != undefined && <KeywordCard props={keyword.keywordEntity} emotiontags={keyword.keywordEntity.
keywordEmotionEntityList} />}
      </div>
    </div>
  );
};

export default MessageCard;
