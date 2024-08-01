import React, { useState } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday, isSameWeek, isBefore, isAfter } from 'date-fns';
import './Diary.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import DiaryDetail from '../../components/diary-report/DiaryDetail';

const Diary = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // 상태 추가
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const navigate = useNavigate();

  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });

  // 이전 주 이동
  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  // 다음 주 이동
  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  // 다이어리 작성 페이지 이동
  const handleAddButtonClick = () => {
    navigate('/with-happyre');
  };

  // 날짜 렌더
  const renderDaysOfWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const isCurrentDay = isToday(day);
      const dayLabel = format(day, 'EEE').toUpperCase();
      const year = format(day, 'yyyy');
      const month = format(day, 'MM');
      const date = format(day, 'dd');
      days.push(
        <div
          className={`diary-day ${isCurrentDay ? 'diary-day-today' : ''}`}
          key={i}
        >
          {isCurrentDay && (
            <div className='diary-add-btn'>
              <Button
                className='btn light-btn'
                content='Add'
                onClick={handleAddButtonClick}
              />
            </div>
          )}
          <div
            className='diary-day-dot-container'
            onClick={() => {
              setSelectedDay({
                year,
                month,
                date,
                dayLabel
              }); // 날짜 객체 설정
              setShowModal(true); // 모달 열기
            }}
          >
            <div
              className={`diary-day-dot ${isCurrentDay ? 'diary-day-dot-today' : ''}`}
            ></div>
            <div
              className={`diary-day-label ${isCurrentDay ? 'diary-day-label-today' : ''}`}
            >
              {dayLabel}
            </div>
            <div
              className={`diary-day-number ${isCurrentDay ? 'diary-day-number-today' : ''}`}
            >
              {format(day, 'dd')}
            </div>
          </div>
        </div>
      );
    }
    return days;
  };

  // Get the status for the current week
  const getWeekStatus = () => {
    const startOfTodayWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    if (isSameWeek(startDate, startOfTodayWeek, { weekStartsOn: 1 })) {
      return 'THIS WEEK';
    } else if (isBefore(startDate, startOfTodayWeek)) {
      return 'PRE WEEK';
    } else if (isAfter(startDate, startOfTodayWeek)) {
      return 'NEXT WEEK';
    }
  };

  return (
    <div className='Diary'>
      <div className='diary-container'>
        <div className='diary-week-control-container'>
          <svg
            onClick={handlePreviousWeek}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-left-fill"
            viewBox="0 0 16 16"
          >
            <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
          </svg>
          <span className='diary-week-control-text'>{getWeekStatus()}</span>
          <svg
            onClick={handleNextWeek}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-caret-right-fill"
            viewBox="0 0 16 16"
          >
            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
          </svg>
        </div>
        <div className='diary-week-info-container'>
          <div className='diary-week-line'></div>
          {renderDaysOfWeek()}
        </div>
      </div>
      <div className='modal-container'>
        {showModal && (
          <DiaryDetail 
            selectedDay={selectedDay} // 전체 날짜 정보 전달
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Diary;
