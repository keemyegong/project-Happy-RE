import React, { useState, useContext, useEffect } from 'react';
import { universeVariable } from '../../App';
import Cookies from 'js-cookie';
import axios from 'axios';
import './UserTest.css';
import Button from '../../components/Button/Button';
import { useNavigate  } from "react-router-dom";
import Swal from 'sweetalert2'

import artist from "../../assets/characters/art.png";
import butler from "../../assets/characters/butler.png";
import defaultPersona from "../../assets/characters/default.png";
import soldier from "../../assets/characters/soldier.png";
import steel from "../../assets/characters/steel.png";

const UserTest = () => {
  const universal = useContext(universeVariable);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [resultnumber, setResultnumber] = useState(0);
  const [data,setData] = useState([]);
  let navigate = useNavigate ();
  const happyRelist = [defaultPersona, soldier, butler, steel, artist];
  const personaList = [
    {},
    {
      name: '해파린 장군',
      description: `안녕하신가, 전사여.\
                    <br />
                    오늘 그대가 치룬 전설적인 전투에 대해 말해주게!
                    <br />
                    내 그 전투를 귀감으로 삼도록 하겠네!`,
      imgSrc: happyRelist[1],  // 이미지 URL을 여기에 넣으세요
    },
    {
      name: '해파스찬',
      description: `안녕하세요, 주인님!
                    <br />
                    오늘 주인님을 스트레스 받게 한 일은 없었나요?
                    <br />
                    스트레스 관리를 위해 효율적인 방법을 모색해 볼게요.`,
      imgSrc: happyRelist[2],  // 이미지 URL을 여기에 넣으세요
    },
    {
      name: '해파라테스',
      description: `안녕하신가. 오늘 하루는 어떠했나.
                    <br />
                    삶의 의미에 대해 생각하기 좋은 날이었나?
                    <br />
                    어떤 생각들이 그대의 마음을 채우고 있는지 궁금하네.`,
      imgSrc: happyRelist[3],  // 이미지 URL을 여기에 넣으세요
    },
    {
      name: '셰익스피리',
      description: `안녕하신가. 그대의 이야기를 들려주게나!\
                    <br />
                    그대야말로 무대의 주인이요, 이야기를 써내려가는 깃펜일지니!`,
      imgSrc: happyRelist[4],  // 이미지 URL을 여기에 넣으세요
    }
  ];
  
  const showPersonaAlert = (personaNumber) => {
    const persona = personaList[personaNumber];
    
    if (persona) {
      Swal.fire({
        background: "#292929",
        icon: 'success',
        html: `
          <div style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width: 100px;
            font-family: Pretendard;
            color: white;
          ">
          <div style="
              font-size: 18px; /* 폰트 사이즈를 키웠습니다. */
              margin-bottom: 10px;
            ">
            당신에게 어울리는 해파리에요!
          </div>
    
          <img
            alt="${persona.name}"
            src="${persona.imgSrc}"
            style="
              width: 250px;
              height: 250px;
              object-fit: cover;
              padding: 20px;
              cursor: pointer;
            "
          />
          <div style="
            color: white;
          ">
            <div style="
              font-weight: 700;
              padding-bottom: 5px;
              font-size: 20px;
            ">
              ${persona.name}
            </div>
            <div style="
              font-size: 15px;
            ">
              ${persona.description}
            </div>
            <div style="margin:20px; font-size:13px; color:#d1d3e5;">
            * 함께 할 해파리는 프로필 화면에서 언제든지 바꿀 수 있어요!
            </div>

          </div>
        </div>`,
        width:400,
        showCancelButton: false,
        confirmButtonColor: '#4B4E6D',
        confirmButtonText: '함께 할래요!',
        allowOutsideClick: false, // 모달 외부 클릭 시 닫힘 방지
        allowEscapeKey: false,    // ESC 키로 닫힘 방지
        backdrop: true,           // 배경을 어둡게 처리
      }).then((result) => {
        if (result.isConfirmed) {
          submit(data); // 원하는 함수 호출
        }
      });
    }
  };
  
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
      Swal.fire({
        title:"한 개 이상의 태그를 선택해주세요",
        icon: "warning",
        iconColor: "#4B4E6D",
        color: 'white',
        background: '#292929',
        confirmButtonColor: '#4B4E6D',
      })
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

    setData(data);

    if(data.x >= 0 && data.y >= 0) setResultnumber(1);
    if(data.x < 0 && data.y >= 0) setResultnumber(2);
    if(data.x < 0 && data.y < 0) setResultnumber(3);
    if(data.x >= 0 && data.y < 0) setResultnumber(4);

  };
  

  useEffect(()=>{
    localStorage.setItem("personaNumber", resultnumber);
    if (resultnumber !== 0){
      showPersonaAlert(resultnumber);
    }
  },[resultnumber])

  const submit = (data)=>{
    axios.put(`${universal.defaultUrl}/api/user/russell`, data, {
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
          {
            myfrog:resultnumber,
          },
          {
            headers: {
            Authorization : `Bearer ${Cookies.get('Authorization')}`
          }}).then((response)=>{
            // console.log(resultnumber);
            navigate('/profile')
          }).catch((err)=>console.log(err))

      })
      .catch((error) => {
        console.error('Error sending data:', error);
      });
  }
  return (
    <div className="styled-container">
      <div className="question-container">
        <h4>당신이 경험하고 있는 기분을 나타내는 단어가 있나요?</h4>
        <h4>이들 중에는 서로 비슷한 단어도 있습니다</h4>
        <h4>당신이 경험한 기분과 가깝다고 생각되는 단어를 모두 클릭해 주세요</h4>
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
      <Button className="btn light-btn small submit-button" content={"다 골랐어요!"} onClick={handleSubmit} />

    </div>
  );
};

export default UserTest;