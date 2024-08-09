import React, { useState,useEffect } from 'react';
import './DiaryReport.css';
import KeywordCard from './KeywordCard';
import EmotionGraph from '../emotion-graph/EmotionGraph';
import Test from '../emotion-graph/Test';

const DiaryReport = ({ selectedDay,loading, keywords, hideplus, daySummary }) => {

  if (!selectedDay) return null; // selectedDay가 없으면 아무것도 렌더링하지 않음
  const { year, month, date } = selectedDay;
  let postiveKeyword = 0;
  let negativeKeyword = 0;
  const postiveKeywords = [];
  const negativeKeywords = [];
  const emotionData = []
  let russellX = 0;
  let russellY = 0;

  keywords.map((keyword, index) => {
    emotionData.push({x:keyword.russellX,y:keyword.russellY,value:0.8});
    russellX += keyword.russellX/keywords.length;
    russellY += keyword.russellY/keywords.length;
    if (keyword.russellX>=0 && postiveKeyword<3){
      postiveKeyword+=1;
      postiveKeywords.push(keyword);

    } else if (keyword.russellX<0 && negativeKeyword<3){
      negativeKeyword+=1;
      negativeKeywords.push(keyword);
    }
  })

  return (
    <div className='DiaryReport'>
      <div className='diary-report-header'>
        <p className='diary-report-header-text'>{`${year}-${month}-${date} report`}</p>

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
              {postiveKeyword == 0 && <div className='diary-report-keyword-none'>
                <h4 className='diary-report-keyword-none-header'>키워드가 없어요!</h4>
                <p className='diary-report-keyword-none-label-positive'> 많이 힘든 날이었나봐요... <br />내일은 좋은 날이 될 수 있도록, 해피리가 응원할게요! </p>
                </div>}
              { postiveKeywords.map((keyword, index) => {
                  return <KeywordCard
                    key={`positive-${index}`}
                    props={keyword}
                    plusButton={!hideplus}
                  />
              })}
            </div>
          </div>
          <div className='diary-report-keyword-negative'>
            <div className='diary-report-keyword-negative-header'>NEGATIVE</div>
            <div className='diary-report-keyword-negative-content'>
              {negativeKeyword == 0 && <div className='diary-report-keyword-none'>
                  <h4 className='diary-report-keyword-none-header'>키워드가 없어요!</h4>
                  <p className='diary-report-keyword-none-label-negative'> 행복한 날이네요! <br />이런 날이 앞으로 계속 될 수 있도록, 해피리가 응원할게요! </p>
                  </div>}
              {negativeKeywords.map((keyword, index) => {
                    return <KeywordCard
                      key={`positive-${index}`}
                      props={keyword}
                      plusButton={!hideplus}
                    />
                })}
            </div>
          </div>
        </div>
        <div className='diary-report-graph'>
          <div className='diary-report-graph-header'>
            GRAPH
          </div>
          <div className='diary-report-graph-body'>
            <EmotionGraph data={emotionData} />
            <div className='diary-report-graph-label'>
              <p className='diary-report-header diary-report-header-kr'>
                요약
              </p>
              <div className='diary-report-border my-2' />
              <p className='mb-5'>
                {daySummary}
              </p>
              <p className='diary-report-header'>
                Russell Number Avg
              </p>
              <div className='diary-report-border my-2' />
              <p>
                valance : {russellX.toFixed(3)}
              </p>
              <p>
                Arousel : {russellY.toFixed(3)}
              </p>
            </div>
          </div>
        </div>
        <div className='mt-5 text-center diary-report-explain-label'>*Arousel은 각성도를, valance는 긍정도를 나타내요</div>
      </div>}
    </div>
  );
};

export default DiaryReport;
