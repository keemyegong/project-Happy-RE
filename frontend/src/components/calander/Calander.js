import React, { useState } from 'react';
import './Calander.css'
import { format, startOfWeek, addDays, addMonths, subMonths, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay } from 'date-fns';

const Calendar = () => {
  // currentDate 상태를 초기화하여 현재 날짜를 기본값으로 설정
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 캘린더 헤더를 렌더링하는 함수
  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy'; // 헤더에 표시할 날짜 형식

    return (
      <div className='header row flex-middle'>
        {/* 이전 달로 이동하는 버튼 */}
        <div className='col col-start'>
          <div className='icon' onClick={prevMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
            </svg>
          </div>
        </div>
        {/* 현재 년도와 월을 표시 */}
        <div className='col col-center'>
          <span>{format(currentDate, dateFormat)}</span>
        </div>
        {/* 다음 달로 이동하는 버튼 */}
        <div className='col col-end' onClick={nextMonth}>
          <div className='icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
            </svg>
          </div>
        </div>
        <div className='header-line'>
        </div>
      </div>
    );
  };

  // 요일을 렌더링하는 함수
  const renderDays = () => {
    const days = [];
    const dateFormat = 'E'; // 요일 형식
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // 현재 주의 시작 날짜 (월요일 기준)

    // 7일을 순회하며 요일을 렌더링
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className='col col-center' key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className='days row'>{days}</div>;
  };

  // 날짜 셀을 렌더링하는 함수
  const renderCells = () => {
    const monthStart = startOfMonth(currentDate); // 현재 달의 시작 날짜
    const monthEnd = endOfMonth(monthStart); // 현재 달의 마지막 날짜
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // 렌더링할 시작 주의 시작 날짜 (월요일 기준)
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }); // 렌더링할 마지막 주의 마지막 날짜 (월요일 기준)

    const dateFormat = 'd'; // 날짜 형식
    const rows = []; // 각 주(row)를 저장할 배열
    let days = []; // 각 날(day)을 저장할 배열
    let day = startDate; // 현재 렌더링할 날짜
    let formattedDate = ''; // 형식화된 날짜 문자열

    // 시작 날짜부터 마지막 날짜까지 순회하며 날짜 셀을 생성
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;

        days.push(
          <div
            className={`col cell ${!isSameMonth(day, monthStart)
              ? 'disabled' // 현재 달에 속하지 않는 날짜는 비활성화
              : isSameDay(day, currentDate) ? 'selected' : ''}`} // 현재 선택된 날짜는 강조 표시
            key={day}
            onClick={() => onDateClick(cloneDay)} // 날짜 클릭 시 현재 날짜로 설정
          >
            <span className='number'>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1); // 다음 날로 이동
      }
      rows.push(
        <div className='row' key={day}>
          {days}
        </div>
      );
      days = []; // 새로운 주(row)를 위해 days 배열 초기화
    }
    return <div className='body'>{rows}</div>;
  };

  // 날짜 클릭 시 호출되는 함수
  const onDateClick = day => {
    setCurrentDate(day);
  };

  // 다음 달로 이동하는 함수
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 이전 달로 이동하는 함수
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <div className='calendar'>
      {renderHeader()} {/* 캘린더 헤더 렌더링 */}
      {renderDays()} {/* 요일 렌더링 */}
      {renderCells()} {/* 날짜 셀 렌더링 */}
    </div>
  );
};

export default Calendar;
