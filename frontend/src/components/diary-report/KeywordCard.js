import React from 'react';
import './KeywordCard.css';

const DiaryReport = ({ selectedDay }) => {
  const { year, month, date, dayLabel } = selectedDay;

  const KeywordTitle = 'LOREM';
  const KeywordContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  const EmotionTags = { 1: '#기쁨', 2: '#신남', 3: '#행복' };

  return (
    <div className='KeywordCard'>
      <div className='keyword-title'>{KeywordTitle}</div>
      <div className='keyword-content'>{KeywordContent}</div>
      <p className='keyword-line'></p>
      <span className='emotion-tags'>
        {Object.entries(EmotionTags).map(([key, tag]) => (
          <span key={key} className='emotion-tag'>{tag}</span>
        ))}
      </span>
    </div>
  );
};

export default DiaryReport;
