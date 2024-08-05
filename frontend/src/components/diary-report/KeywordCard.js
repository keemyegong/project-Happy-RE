// keywordcard.js
import React from 'react';
import './KeywordCard.css';

const KeywordCard = ({ props }) => {
  const { title, date, content, emotionTags } = props;

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
