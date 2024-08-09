import React, { useEffect } from 'react';
import './CharacterList.css';
import artist from '../../assets/characters/art.png';
import butler from '../../assets/characters/butler.png';
import defaultPersona from '../../assets/characters/default.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';

const CharacterList = ({ nearbyUsers, displayStartIndex, handleScroll, talkingUsers, coolTime }) => {
  return (
    <div className="right-panel">
      <div className="scroll-buttons">
        <button onClick={() => handleScroll('up')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
          </svg>
        </button>
      </div>
      <div className="character-list">
        {nearbyUsers.slice(displayStartIndex, displayStartIndex + 4).map((user, index) => (
          <div 
            key={user.id}
            className={`character-image-small-wrapper ${talkingUsers.includes(user.id) ? 'talking' : ''}`}
          >
            <img 
              src={user.image} 
              alt="character"
              className="character-image-small"
            />
          </div>
        ))}
      </div>
      <div className="scroll-buttons">
        <button onClick={() => handleScroll('down')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CharacterList;
