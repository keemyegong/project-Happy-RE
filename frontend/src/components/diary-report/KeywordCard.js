// keywordcard.js
import React from 'react';
import './KeywordCard.css';

const KeywordCard = ({ keyword }) => {
  const { title, date, content, emotionTags } = keyword;

  return (
    <div className='KeywordCard'>
      <div className='keyword-title'>{title}</div>
      <div className='keyword-content'>{content}</div>
      <p className='keyword-line'></p>
      <div className='keyword-date'>{date}</div>
      <span className='emotion-tags'>
        {emotionTags.map((tag, index) => (
          <span key={index} className='emotion-tag'>{tag}</span>
        ))}
      </span>
    </div>
  );
};

export default KeywordCard;
