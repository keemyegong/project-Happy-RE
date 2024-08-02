import React, { useState } from 'react';
import './DiaryReport.css';
import KeywordCard from './KeywordCard';
import EmotionGraph from '../emotion-graph/EmotionGraph';
import Test from '../emotion-graph/Test';

const DiaryReport = ({ selectedDay }) => {
  const [emotionData, setEmotionData] = useState([]); 
  if (!selectedDay) return null; // selectedDay가 없으면 아무것도 렌더링하지 않음
  const { year, month, date, dayLabel } = selectedDay;

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
              {[1, 2, 3].map((item) => (
                <KeywordCard key={`positive-${item}`} selectedDay={selectedDay} />
              ))}
            </div>
          </div>
          <div className='diary-report-keyword-negative'>
            <div className='diary-report-keyword-negative-header'>NEGATIVE</div>
            <div className='diary-report-keyword-negative-content'>
              {[1, 2, 3].map((item) => (
                <KeywordCard key={`negative-${item}`} selectedDay={selectedDay} />
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
