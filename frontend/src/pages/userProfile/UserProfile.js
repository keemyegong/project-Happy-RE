import React, { useState,useContext, useEffect, useRef } from 'react';
import {universeVariable} from '../../App';
import axios from 'axios';
import './UserProfile.css';
import Cookies from 'js-cookie';
import Button from '../../components/Button/Button';
import { useNavigate  } from "react-router-dom";
import userProfileImage from '../../assets/sampleUserImage.jpg'
import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import Calendar from '../../components/calander/Calander';
import EmotionGraph from '../../components/emotion-graph/EmotionGraph';

import artist from '../../assets/characters/art.png'
import butler from '../../assets/characters/butler.png'
import defaultPersona from '../../assets/characters/default.png'
import soldier from '../../assets/characters/soldier.png'
import steel from '../../assets/characters/steel.png'

import { Modal } from 'react-bootstrap';

const UserProfile =  ()=>{

  const happyRelist = [defaultPersona, soldier, butler, steel, artist]
  const happyReHello = [
    "안녕하세요! 해피리에요!",
    "대충 장군이 할 것 같은 말",
    "대충 집사가 할 것 같은 말",
    "대충 철학자가 할 것 같은 말",
    "대충 셰익스피어같은 말"
  ]
  // const data = [
  //   { text: 'Hey', value: 15 },
  //   { text: 'lol', value: 25 },
  //   { text: 'first impression', value: 30 },
  //   { text: 'very cool', value: 40 },
  //   { text: 'duck', value: 10 },
  //   { text: 'first impression', value: 30 },
  //   { text: 'very cool', value: 500 },
  //   { text: 'duck', value: 20 },
  //   { text: 'first impression', value: 30 },
  //   { text: 'very cool', value: 40 },
  //   { text: 'duck', value: 10, color:'red'},
  // ]

  const [image,setImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [words, setWords] = useState('');
  const [emotionData, setEmotionData] = useState([]); 
  const [data, setData] = useState([]);
  const universal = useContext(universeVariable);
  let navigate = useNavigate ();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  useEffect(()=>{
    setImage(userProfileImage);
    universal.setIsAuthenticated(true);

    axios.get(`${universal.defaultUrl}/api/user/me`,
      {headers: {Authorization : `Bearer ${Cookies.get('Authorization')}`}}
    ).then((Response)=>{
      console.log(Response.data)
      setNickname(Response.data.name);
      setEmail(Response.data.email);
      localStorage.setItem("personaNumber", Response.data.myfrog);

    }).then(()=>{
      axios.get(`${universal.defaultUrl}/api/user/profileimg`,
      {headers:{Authorization : `Bearer ${Cookies.get('Authorization')}`},
      responseType:'blob',
      }
      ).then((Response)=>{
        const blobData = new Blob([Response.data], { type: 'image/jpeg' });
        const url = window.URL.createObjectURL(blobData);
        setImage(url);

      }).catch(()=>{
        console.log('이미지 파일이 존재하지 않습니다.');
        setImage(userProfileImage);

      })

      axios.get(`${universal.defaultUrl}/api/keyword`,
        {headers:{
            Authorization : `Bearer ${Cookies.get('Authorization')}`,
           'Content-Type': 'application/json'
        }}
        ).then((response)=>{
          // 키워드 값과 카운트를 저장할 맵 객체 생성
          const keywordMap = new Map();

          // 각 키워드 값의 카운트를 계산
          response.data.forEach(keywordEntity => {
            const keyword = keywordEntity.keyword;
            if (keywordMap.has(keyword)) {
              keywordMap.set(keyword, keywordMap.get(keyword) + 1);
            } else {
              keywordMap.set(keyword, 1);
            }
          });
          
          // 키워드 맵을 객체로 변환하여 출력
          const keywordObject = Object.fromEntries(keywordMap);
          console.log(keywordObject);
          const wordCloudData = Object.keys(keywordObject).map(keyword => ({
            text: keyword,
            value: keywordObject[keyword]*30
          }));
          setData(wordCloudData);
  
        }).catch(error => {
          // 에러가 발생했을 때 실행할 코드
          if (error.response) {
              // 서버가 응답을 반환했을 때 (4xx, 5xx 응답 코드)
              console.error('Error status:', error.response.status);
              console.error('Error data:', error.response.data);
          } else if (error.request) {
              // 요청이 만들어졌으나 서버로부터 응답이 없을 때
              console.error('No response received:', error.request);
          } else {
              // 요청을 설정하는 중에 에러가 발생했을 때
              console.error('Error setting up request:', error.message);
          }
        })


    }).catch(()=>{
      console.log('서버와통신불가')
    })
  },[])

  const showModal = ()=>{

    setShow(show=='show-modal'?'unshow-modal':'show-modal');
  }

  const changePersona = (happyreNumber)=>{
    localStorage.setItem("personaNumber", happyreNumber);
    axios.put(
      `${universal.defaultUrl}/api/user/me`,
      {
        myfrog:happyreNumber,
      },
      {
        headers: {
        Authorization : `Bearer ${Cookies.get('Authorization')}`
      }})
    setShow(show=='show-modal'?'unshow-modal':'show-modal');

  }
  
  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

  return(
    <>

    <div className='container-fluid user-profile-container'>
      <div className='row' >
        <div className='col-12 col-md-4 col-xxl-2 '>
          <div className='default-info'>
          <div className='user-avatar'>
            <img className='profile-image' src={image}/>
          </div>
          <div className='default-info-container'>
            <p className='nickname'>{nickname}</p>
            <p className='email'>{email}</p>
            <Button className='profile-edit-btn btn light-btn small' content='Edit Profile' onClick={()=>{
              navigate('/user/update')
            }} />
          </div>
          </div>
        </div>
        <div className='col-12 col-md-8 col-xxl-10'>
          <div className='user-emotion-info-container row'>
          <div className='col-12 col-xxl-6'> 
            <div className='profile-mywords-title text-white'>
              <p className='profile-mywords-title-text'>My Words</p>
            </div>
            <div className='wordcloud-container'>
            <WordCloud 
              data={data}
              width={300}
              height={100}
              font="Times"
              fontWeight="bold"
              fontSize={(word) => Math.log2(word.value) * 2.2}
              spiral="rectangular"
              // rotate={(word) => (word.value*100)% 360}
              padding={5}
              fill={(d, i) => {
                const rand = Math.floor(Math.random() * 10);
                return `rgba(215,218,249,${1-rand*0.07})`
              }}
              
              />
              </div>
              <div className='my-5 calender-container'>
                <Calendar/>

              </div>
          </div>
          <div className='col-12 col-xxl-6'> 
            <div className='profile-emotion-title text-white'>
              <p className='profile-emotion-title-text'>Emotion Graph</p>
            </div>
            <div className='emotion-graph-container'>
              <EmotionGraph data={emotionData} />
            </div>

            <div className='change-happyre-persona my-5'>
              {/* 해피리 페르소나 영역 */}
              <div className='persona-chat-container '>
                <div className='persona-chat '>
                  {happyReHello[localStorage.getItem('personaNumber')]}
                </div>
              </div>
              <div className='persona-image-container'>
                <img className='happyre-persona-image' alt='해파리 페르소나' src={happyRelist[localStorage.getItem('personaNumber')]} />
                <div className='persona-change-button' onClick={showModal}>
                <span class="material-symbols-outlined">
                edit
                </span>
                </div>
                
              </div>
            </div>

          </div>
          </div>

        </div>  
      </div>
    </div>
    
    <div className={show}>
      <div className='happyre-persona-change-container'>
        <div className='row row-cols-2 row-cols-lg-3 justify-content-center'>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={()=>{changePersona(0)}}>
              <img src={happyRelist[0]} className='happyre-choice-preview' />
            </div>
          </div>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={()=>{changePersona(1)}}>
              <img src={happyRelist[1]} className='happyre-choice-preview' />
            </div>
          </div>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={()=>{changePersona(2)}}>
              <img src={happyRelist[2]} className='happyre-choice-preview' />
            </div>
          </div>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={()=>{changePersona(3)}}>
              <img src={happyRelist[3]} className='happyre-choice-preview' />
            </div>
          </div>
          <div className='col'>
            <div className='happyre-persona-icon-container' onClick={()=>{changePersona(4)}}>
              <img src={happyRelist[4]} className='happyre-choice-preview' />
            </div>
          </div>

        </div>
        <Button className='btn light-btn small' content='Close' onClick={showModal} />
      </div>
    </div>
    </>
  );

}

export default UserProfile;
