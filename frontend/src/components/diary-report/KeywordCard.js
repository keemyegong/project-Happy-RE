import React, { useState } from 'react';
import './KeywordCard.css';
import AddEmotionTag from './AddEmotionTag';

const KeywordCard = ({ props, plusButton }) => {
  const { keyword,summary, emotionTags} = props;
  return (
    <div className='KeywordCard'>
      <div className='keyword-title'>{keyword}</div>
      <div className='keyword-date'></div>
      <div className='keyword-content'>{summary}</div>
      {emotionTags!= null || plusButton != false && <p className='keyword-line'></p>}
      <span className='emotion-tags'>
          {emotionTags!=null && emotionTags.map((tag, index) => (
            <span key={index} className='emotion-tag'>{tag}</span>
          ))}
          {emotionTags == null && plusButton==true && '# 감정을_추가해봐요'}
          {plusButton && (
            <AddEmotionTag keyword={props} />
          )}
      </span>
    </div>
  );
};

export default KeywordCard;
