import React, { useState, useContext } from 'react';
import { universeVariable } from '../../App';
import Cookies from 'js-cookie';
import axios from 'axios';
import './UserTest.css';
import Button from '../../components/Button/Button';
import { useNavigate  } from "react-router-dom";

const UserTest = () => {
  const universal = useContext(universeVariable);
  const [selectedChoices, setSelectedChoices] = useState([]);
  let navigate = useNavigate ();

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

    axios.put(`${universal.defaultUrl}/api/user/russel`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('Authorization')}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        console.log('Data sent successfully:', response.data);
        axios.put(
          `${universal.defaultUrl}/api/user/me`,
          {},
          {
            headers: {
            Authorization : `Bearer ${Cookies.get('Authorization')}`
          }}).then((response)=>{
            navigate('/profile')
          }).catch((err)=>console.log(err))

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
      <Button className="btn light-btn small submit-button" content={"제출"} onClick={handleSubmit} />

    </div>
  );
};

export default UserTest;
