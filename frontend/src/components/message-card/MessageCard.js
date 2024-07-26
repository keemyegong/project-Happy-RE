import React, { useState } from 'react';
import './MessageCard.css';

const MessageCard = ({ profileImageUrl, userName, content }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="message-card">
      <div className="message-card-header">
        {profileImageUrl && <img src={profileImageUrl} alt={userName} className="profile-image" />}
        <div className="user-info">
          <h3 className="user-name">{userName}</h3>
          <button className={`favorite-button ${isFavorite ? 'favorite' : ''}`} onClick={handleFavoriteClick}>
            {isFavorite ? '★' : '☆'}
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
