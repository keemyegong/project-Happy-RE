import React, { useState } from 'react';
import './MessageCard.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const MessageCard = ({ messageId, profileImageUrl, userName, content }) => {
  const [favorite, setFavorite] = useState(false);

  const handleFavoriteClick = () => {
    const newFavoriteStatus = !favorite;
    const url = newFavoriteStatus ? '/api/messages/archive' : '/api/messages/unarchive';

    axios
      .post(
        url,
        { messageId },
        {
          headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` },
        }
      )
      .then(() => {
        setFavorite(newFavoriteStatus);
      })
      .catch((error) => {
        console.error('Failed to update favorite status:', error);
      });
  };

  return (
    <div className="message-card">
      <div className="message-card-header">
        {profileImageUrl && <img src={profileImageUrl} alt={userName} className="profile-image" />}
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
    </div>
  );
};

export default MessageCard;
