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
            {favorite ? '★' : '☆'}
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
