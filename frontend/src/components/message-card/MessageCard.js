import React, { useState, useContext  } from 'react';
import './MessageCard.css';
import {universeVariable} from '../../App';

import artist from '../../assets/characters/art.png';
import butler from '../../assets/characters/butler.png';
import defaultPersona from '../../assets/characters/default.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';


import axios from 'axios';
import Cookies from 'js-cookie';
import userProfileImage from '../../assets/sampleUserImage.jpg';
import KeywordCard from '../diary-report/KeywordCard';

const MessageCard = ({ messageId, persona, userName, content, keyword, archived, deleteArchived }) => {

  const universal = useContext(universeVariable);
  const [favorite, setFavorite] = useState(archived);
  const happyrePersnonaName = ["해피리","해파린 장군","해파스찬","해파라테스","셰익스피리"];
  const happyRelist = [defaultPersona, soldier, butler, steel, artist];

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
      if (deleteArchived != undefined){
        deleteArchived(messageId);
      }
    })
  }
  
  const handleFavoriteClick = () => {
    if(archived){
      deleteArchived(messageId);
    }
    else if (favorite){
      delteArchive();


    }else{
      addArchive();
    }

  };

  return (
    <div className="message-card">
      <div className="message-card-header">
        <img src={happyRelist[persona]} alt={happyrePersnonaName[persona]} className="profile-image" />
        <div className="user-info">
          <h3 className="user-name">{happyrePersnonaName[persona]}</h3>
          <button className={`favorite-button ${archived || favorite ? 'favorite' : ''}`} onClick={handleFavoriteClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-star-fill click-star ${archived || favorite ? 'filled' : ''}`} viewBox="0 0 16 16">
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
