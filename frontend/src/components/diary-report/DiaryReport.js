import React from 'react';
import './DiaryReport.css';

const DiaryReport = ({ selectedDay, onClose }) => {
  if (!selectedDay) return null; // selectedDay가 없으면 아무것도 렌더링하지 않음

  const { year, month, date, dayLabel } = selectedDay;

  return (
    <div className='diary-report-container'>
      <div className="modal fade show" style={{ display: 'block', opacity: 1 }} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="diary-modal modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {`${year}-${month}-${date} (${dayLabel})`}
              </h1>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* 모달 내용 */}
              <p>Date: {`${year}-${month}-${date}`}</p>
              <p>Day: {dayLabel}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ display: 'block', opacity: 0.5 }}></div>
    </div>
  );
};

export default DiaryReport;
