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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-star-fill click-star ${favorite ? 'filled' : ''}`} viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
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
