import React, { useState } from 'react';
import './DiaryReport.css';
import KeywordCard from './KeywordCard';
import EmotionGraph from '../emotion-graph/EmotionGraph';
import Test from '../emotion-graph/Test';

const DiaryReport = ({ selectedDay,loading }) => {
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
      {loading &&
      <div className='modal-loading-container'> 
        <div className='spinner-border diary-modal-popup-spinner' role="status">
          <span className='visually-hidden'>Loading...</span>
        </div>
        <p className='modal-loading-label'>
          Loading...
        </p>
        <h5 className='modal-loading-text my-4 text-center'>해파리들이 당신의 소중한 오늘을<br></br> 열심히 정리하고 있어요.</h5>
      </div>
      }

      {!loading && <div className='diary-report-body'>
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
                  plusButton={true}
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
                  plusButton={true}
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
      </div>}
    </div>
  );
};

export default DiaryReport;
