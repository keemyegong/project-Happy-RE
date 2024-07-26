import React, { useState } from 'react';
import axios from 'axios';
import './UserTest.css';

const UserTest = () => {
  const [selectedChoices, setSelectedChoices] = useState([]);

  const choiceLabels = [
    { label: '놀람', coordinates: [0, 1] },
    { label: '긴장', coordinates: [0.1, 0.9] },
    { label: '화남', coordinates: [-0.1, 0.8] },
    { label: '두려움', coordinates: [-0.2, 0.8] },
    { label: '짜증', coordinates: [-0.3, 0.7] },
    { label: '고통', coordinates: [-0.4, 0.6] },
    { label: '좌절', coordinates: [-0.5, 0.5] },
    { label: '비참', coordinates: [-1, 0] },
    { label: '슬픔', coordinates: [-0.9, -0.2] },
    { label: '우울', coordinates: [-0.8, -0.3] },
    { label: '지루함', coordinates: [-0.6, -0.5] },
    { label: '풀이 죽음', coordinates: [-0.5, -0.6] },
    { label: '피곤', coordinates: [-0.4, -0.7] },
    { label: '졸림', coordinates: [-0.3, -0.8] },
    { label: '차분함', coordinates: [0.3, -0.9] },
    { label: '편안함', coordinates: [0.4, -0.8] },
    { label: '만족', coordinates: [0.6, -0.6] },
    { label: '여유로움', coordinates: [0.6, -0.6] },
    { label: '평온', coordinates: [0.8, -0.4] },
    { label: '기쁨', coordinates: [0.9, -0.3] },
    { label: '즐거움', coordinates: [1, 0] },
    { label: '행복', coordinates: [0.9, 0.2] },
    { label: '흥분', coordinates: [0.7, 0.4] },
    { label: '유쾌한', coordinates: [0.6, 0.5] },
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

    const averageCoordinates = selectedChoices
      .map(index => choiceLabels[index].coordinates)
      .reduce(
        (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
        [0, 0]
      ).map(sum => sum / selectedChoices.length);

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
        {choiceLabels.map((item, index) => (
          <button
            key={index}
            className={`choice-button ${selectedChoices.includes(index) ? 'selected' : ''}`}
            onClick={() => handleChoiceChange(index)}
          >
            {item.label}
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
