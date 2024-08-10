import React, { useState } from 'react';
import './KeywordCard.css';
import AddEmotionTag from './AddEmotionTag';

const KeywordCard = ({ props, plusButton, emotiontags }) => {
  const { keyword,summary, emotions, } = props;
  const [emotionTagsRender, setEmotionTagsRender] = useState([]);

  return (
    <div className='KeywordCard'>
      <div className='keyword-title'>{keyword}</div>
      <div className='keyword-date'></div>
      <div className='keyword-content'>{summary}</div>
      <span className='emotion-tags'>
          {emotions!=null && emotions.map((tag, index) => (
            <span key={index} className='emotion-tag'># {tag.emotion}</span>
          ))}
          {emotionTagsRender.length === 0 && plusButton==true && '# 감정을_추가해봐요'}
          {emotionTagsRender !== null && plusButton == true && 
            emotionTagsRender.map((tag, index) => (
              <span key={index} className='emotion-tag'># {tag}</span>
            ))
          }
          {emotiontags != null && 
            emotiontags.map((tag, index) => (
              <span key={index} className='emotion-tag'># {tag.emotionEntity.emotion}</span>
            ))
          }
          {plusButton && (
            <AddEmotionTag props={props} setEmotionTagsRender={setEmotionTagsRender} emotionTagsRender={emotionTagsRender} />
          )}
      </span>
    </div>
  );
};

export default KeywordCard;
