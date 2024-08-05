import React, { useState, useEffect } from 'react';
import './Timer.css'; // CSS 스타일을 별도로 설정합니다.

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 90;

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [remainingPathColor, setRemainingPathColor] = useState(COLOR_CODES.info.color);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        const updatedTimeLeft = prevTimeLeft - 1;
        if (updatedTimeLeft <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        setRemainingPathColor(getRemainingPathColor(updatedTimeLeft));
        return updatedTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  };

  const getRemainingPathColor = (timeLeft) => {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      return alert.color;
    } else if (timeLeft <= warning.threshold) {
      return warning.color;
    }
    return info.color;
  };

  const calculateTimeFraction = () => {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  };

  const setCircleDasharray = () => {
    return `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} ${FULL_DASH_ARRAY}`;
  };

  return (
    <div className="base-timer">
      <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g className="base-timer__circle">
          {/* <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle> */}
          {
            timeLeft>=1 && 

          <path
            id="base-timer-path-remaining"
            strokeDasharray={setCircleDasharray()}
            className={`base-timer__path-remaining ${remainingPathColor}`}
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
          }
        </g>
      </svg>
      <span className="base-timer__label">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;