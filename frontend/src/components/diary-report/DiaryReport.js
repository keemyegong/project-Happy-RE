import React from 'react';
import './DiaryReport.css';

const DiaryReport = ({ selectedDay }) => {
  if (!selectedDay) return null; // selectedDay가 없으면 아무것도 렌더링하지 않음

  const { year, month, date, dayLabel } = selectedDay;

  return (
    <div className='DiaryReport'>
      <div className='diary-report-header'>
        {`${year}-${month}-${date} REPORT`}
      </div>
      <div className='diary-report-body'>
        <div className='diary-report-keyword'>
          <div className='diary-report-keyword-header'>
            KEYWORD
          </div>
          <div className='diary-report-keyword-positive'>
            <div className='diary-report-keyword-positive-content'>

            </div>
          </div>
          <div className='diary-report-keyword-negative'>
            NEGATIVE
            <div className='diary-report-keyword-negative-content'>
            </div>
          </div>
        </div>
        <div className='diary-report-graph'>
          <div className='diary-report-graph-header'>
            GRAPH
          </div>
          <div className='diary-report-graph-body'>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryReport;
