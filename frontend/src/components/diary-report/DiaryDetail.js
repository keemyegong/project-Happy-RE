import React from 'react';
import './DiaryDetail.css';
import DiaryReport from './DiaryReport';

const DiaryDetail = ({ selectedDay, onClose, dropChat, loading }) => {
  if (!selectedDay) return null; // selectedDay가 없으면 아무것도 렌더링하지 않음

  const { year, month, date, dayLabel } = selectedDay;

  return (
    <div className='diary-detail-container'>
      <div className='diary-detail-backdrop' onClick={onClose}></div>
      <div className='diary-detail-modal'>
        <div className='diary-detail-header'>
          <button className='diary-detail-close-btn' onClick={onClose}>&times;</button>
        </div>
        <div className='diary-detail-body'>
          <div className='diary-detail-components'>
            {!dropChat && <div className='diary-chat-box-container'>
              {/* 선택일 채팅 박스 영역 */}
            </div>}
            <div className='diary-report-container'>
              {/* 선택일 레포트 영역 */}
              <DiaryReport
                selectedDay={selectedDay}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryDetail;
