import React, { useState } from 'react';
import axios from 'axios';
import './UserTest.css';

const UserTest = () => {
  const [selectedChoices, setSelectedChoices] = useState([]);

  const choiceLabels = [
    '행복하다', '만족스럽다', '뿌듯하다', '산뜻하다', '신난다', '유쾌하다',
    '화가난다', '짜증난다', '두렵다', '답답하다', '막막하다', '걱정스럽다',
    '불쾌하다', '한심하다', '처량하다', '슬프다', '지겹다', '지쳤다',
    '귀찮다', '차분하다', '괜찮다', '평화롭다', '편안하다', '느긋하다',
  ];

  const handleChoiceChange = (index) => {
    setSelectedChoices((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const handleSubmit = () => {
    if (selectedChoices.length === 0) {
      console.log('No choices selected');
      return;
    }

    const radians = (degrees) => (degrees * Math.PI) / 180;

    const coordinates = selectedChoices.map((index) => {
      const angle = 15 * index;
      return [0.5 * Math.cos(radians(angle)), 0.5 * Math.sin(radians(angle))];
    });

    const averageCoordinates = coordinates.reduce(
      (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
      [0, 0]
    ).map((sum) => sum / selectedChoices.length);

    console.log(`Average coordinates: [${averageCoordinates[0].toFixed(2)}, ${averageCoordinates[1].toFixed(2)}]`);

    const data = {
      x: averageCoordinates[0].toFixed(2),
      y: averageCoordinates[1].toFixed(2),
    };

    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InFxcXFxcXFxcXFxcSIsInJvbGUiOiJST0xFX1VTRVIiLCJ1c2VyaWQiOjQsImlhdCI6MTcyMTc5NjQyOCwiZXhwIjoxNzIyMDEyNDI4fQ.S_BaHSzoZQ8Trql3o9bAd5OxXm6K4n96KnMyOBg5xv4'; // 여기에 실제 토큰 값을 넣으세요
    const serverUrl = `http://192.168.31.228:8080/api/user/russell`;

    axios.put(serverUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        console.log('Data sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending data:', error);
      });
  };

  return (
    <div className="styled-container">
      <div className="question-container">
        <h4>당신이 경험하고 있는 기분을 나타내는 단어를 클릭해주세요.</h4>
        <h4>이들 중에는 서로 비슷한 단어도 있습니다.</h4>
        <h4>그렇지만 당신이 경험한 기분을 나타낸다고 생각되는 단어를 클릭해주세요.</h4>
      </div>
      <div className="choices-container">
        {choiceLabels.map((label, index) => (
          <button
            key={index}
            className={`choice-button ${selectedChoices.includes(index) ? 'selected' : ''}`}
            onClick={() => handleChoiceChange(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <button className="submit-button" onClick={handleSubmit}>
        제출
      </button>
    </div>
  );
};

export default UserTest;
