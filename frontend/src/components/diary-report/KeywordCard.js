import React, { useState } from 'react';
import './KeywordCard.css';
import AddEmotionTag from './AddEmotionTag';

const KeywordCard = ({ props, plusButton }) => {
  const { title, date, content, emotionTags } = props;

  return (
    <div className='KeywordCard'>
      <div className='keyword-title'>{title}</div>
      <div className='keyword-date'>{date}</div>
      <div className='keyword-content'>{content}</div>
      <p className='keyword-line'></p>
      <span className='emotion-tags'>
          {emotionTags.map((tag, index) => (
            <span key={index} className='emotion-tag'>{tag}</span>
          ))}
          {plusButton && (
            <AddEmotionTag keyword={props} />
          )}
      </span>
    </div>
  );
};

export default KeywordCard;
