// diaryreport.js
import React, { useState } from 'react';
import './DiaryReport.css';
import KeywordCard from './KeywordCard';
import EmotionGraph from '../emotion-graph/EmotionGraph';
import Test from '../emotion-graph/Test';

const DiaryReport = ({ selectedDay }) => {
  const [emotionData, setEmotionData] = useState([]); 
  if (!selectedDay) return null; // selectedDay가 없으면 아무것도 렌더링하지 않음
  const { year, month, date } = selectedDay;

  const dummyPositiveKeywords = [
    {
      title: 'POSITIVE1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      emotionTags: ['#기쁨', '#신남', '#행복'],
      date: `${year}-${month}-${date}`
    },
    {
      title: 'POSITIVE2',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      emotionTags: ['#기쁨', '#신남', '#행복'],
      date: `${year}-${month}-${date}`
    },
    {
      title: 'POSITIVE3',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      emotionTags: ['#기쁨', '#신남', '#행복'],
      date: `${year}-${month}-${date}`
    }
  ];

  const dummyNegativeKeywords = [
    {
      title: 'NEGATIVE1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      emotionTags: ['#슬픔', '#화남', '#우울'],
      date: `${year}-${month}-${date}`
    },
    {
      title: 'NEGATIVE2',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      emotionTags: ['#슬픔', '#화남', '#우울'],
      date: `${year}-${month}-${date}`
    },
    {
      title: 'NEGATIVE3',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      emotionTags: ['#슬픔', '#화남', '#우울'],
      date: `${year}-${month}-${date}`
    }
  ];

  return (
    <div className='DiaryReport'>
      <div className='diary-report-header'>
        {`${year}-${month}-${date} report`}
      </div>
      <div className='diary-report-body'>
        <div className='diary-report-keyword'>
          <p className='diary-report-keyword-header'>
            KEYWORD
          </p>
          <div className='diary-report-keyword-positive'>
            <p className='diary-report-keyword-positive-header'>POSITIVE</p>
            <div className='diary-report-keyword-positive-content'>
              {dummyPositiveKeywords.map((keyword, index) => (
                <KeywordCard
                  key={`positive-${index}`}
                  props={keyword}
                />
              ))}
            </div>
          </div>
          <div className='diary-report-keyword-negative'>
            <div className='diary-report-keyword-negative-header'>NEGATIVE</div>
            <div className='diary-report-keyword-negative-content'>
              {dummyNegativeKeywords.map((keyword, index) => (
                <KeywordCard
                  key={`negative-${index}`}
                  props={keyword}
                />
              ))}
            </div>
          </div>
        </div>
        <div className='diary-report-graph'>
          <div className='diary-report-graph-header'>
            GRAPH
          </div>
          <div className='diary-report-graph-body'>
            <Test data={emotionData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryReport;
