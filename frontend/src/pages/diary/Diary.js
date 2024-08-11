import React, { useState, useEffect, useContext } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday, isSameWeek, isBefore, isAfter } from 'date-fns';
import './Diary.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import DiaryDetail from '../../components/diary-report/DiaryDetail';
import axios from 'axios';
import Cookies from 'js-cookie';
import { universeVariable } from '../../App';
import Swal from 'sweetalert2'


const Diary = () => {
  const universal = useContext(universeVariable);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // 상태 추가
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [showButton, setShowButton] = useState(false);
  const [keyword, setKeyword] = useState([])
  const [chatlog, setChatlog] = useState([])
  const [possibleList, setPossibleList] = useState([]);
  const [daySummary, setDaySummary] = useState('');
  const hideplus = true;


  const navigate = useNavigate();

  const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  let possibleDates = [];

  useEffect(()=>{
    
    axios.get(
      `${universal.defaultUrl}/api/diary/detail/`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }).then((response)=>{
        console.log(response.data.keywordEntities);
        if (response.data.keywordEntities == undefined){
          setShowButton(true);
        }
          axios.get(
          `${universal.defaultUrl}/api/diary/?year=${startDate.getFullYear()}&month=${startDate.getMonth()+1}&day=${startDate.getDate()}&period=7`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('Authorization')}`,
              withCredentials: true,
            }
          }).then((response)=>{
            response.data.forEach(element => {
              possibleDates.push(element.date.substring(0,10));
              
            });
            if (possibleDates.length !== possibleList.length){
              setPossibleList(possibleDates);
            }
            
            console.log(possibleDates);
          }).catch((err)=>{
            console.log(err)
          })
        
        // console.log(response.data);

      })
  },[startDate])
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

  // 해당날짜의 diary받기
  const getDiary = (year, month, date)=>{
    axios.get(
      `${universal.defaultUrl}/api/diary/?year=${year}&month=${month}&day=${date}&period=1`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }).then((response)=>{

        if (response.data[0] != undefined){
          // console.log(response.data);
          setDaySummary(response.data[0].summary);
          const example = response.data[0].diaryId;

          axios.get(
            `${universal.defaultUrl}/api/diary/detail/?diaryid=${response.data[0].diaryId}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('Authorization')}`,
                withCredentials: true,
              }
            }).then((response)=>{
              
              console.log(response.data.messageEntities);
              setKeyword(response.data.keywordEntities);
              setChatlog(response.data.messageEntities);

              setShowModal(true);
            })
          } else {
            Swal.fire({
              title: '다이어리가 없습니다!',
              text: '해파리가 열심히 찾아봤지만, 안타깝게도 해당 날짜에는 하루를 기록한 흔적이 없는 것 같아요.',
              icon: "question",
              iconColor: "#4B4E6D",
              color: 'white',
              background: '#292929',
              confirmButtonColor: '#4B4E6D',
            });
            
          }
      })
  }
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
      const isPossible = possibleList.includes(`${year}-${month}-${date}`);
      // const isPossible = true;

      days.push(
        <div
          className={`diary-day ${isCurrentDay ? 'diary-day-today' : ''}`}
          key={i}
        >
          {isCurrentDay && (
            <div className='diary-add-btn'>
            { showButton && <Button
                className='btn light-btn'
                content='Add'
                onClick={handleAddButtonClick}
              />}
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

              getDiary(year,month,date);
            }}
          >
            <div
              className={`diary-day-dot ${isCurrentDay ? 'diary-day-dot-today' : ''} ${isPossible ? 'diary-day-possible-dot' : ''}` }
            ></div>
            <div
              className={`diary-day-label ${isCurrentDay ? 'diary-day-label-today' : ''} ${isPossible ? 'diary-day-possible' : ''}`}
            >
              {dayLabel}
            </div>
            <div
              className={`diary-day-number ${isCurrentDay ? 'diary-day-number-today' : ''} ${isPossible ? 'diary-day-possible' : ''}`}
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
        <div className='diary-guide'>
          날짜를 클릭하면 그날의 다이어리 레포트를 확인할 수 있어요
        </div>
        <div className='diary-week-info-container'>
          <div className='diary-week-line'></div>
          {renderDaysOfWeek()}
        </div>
      </div>
      <div className='modal-container'>
        {showModal && (
          <DiaryDetail 
            daySummary={daySummary}
            chatlog={chatlog}
            keyword={keyword}
            selectedDay={selectedDay} // 전체 날짜 정보 전달
            onClose={() => setShowModal(false)}
            hideplus={hideplus}
          />
        )}
      </div>
    </div>
  );
};

export default Diary;
