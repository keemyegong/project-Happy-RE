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

const UserProfile =  ()=>{
  const data = [
    { text: 'Hey', value: 15 },
    { text: 'lol', value: 25 },
    { text: 'first impression', value: 30 },
    { text: 'very cool', value: 40 },
    { text: 'duck', value: 10 },
    { text: 'first impression', value: 30 },
    { text: 'very cool', value: 500 },
    { text: 'duck', value: 20 },
    { text: 'first impression', value: 30 },
    { text: 'very cool', value: 40 },
    { text: 'duck', value: 10, color:'red'},
  ]

  const [image,setImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [words, setWords] = useState('');
  const [emotionData, setEmotionData] = useState([]); 
  const universal = useContext(universeVariable);
  let navigate = useNavigate ();
  
  useEffect(()=>{
    axios.get(`${universal.defaultUrl}/api/user/me`,
      {headers: {Authorization : `Bearer ${Cookies.get('Authorization')}`}}
    ).then((Response)=>{
      console.log(Response.data)
      setNickname(Response.data.name);
      setEmail(Response.data.email);

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
    })
  },[])

  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

  return(
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
            <Button className='profile-edit-btn btn dark-btn small' content='Edit Profile' onClick={()=>{
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
              rotate={(word) => (word.value*100)% 360}
              padding={5}
              random={Math.random}
              fill={(d, i) => {
                const rand = Math.floor(Math.random() * 10);
                return `rgba(${rand*20},200,150,0.7)`
              }}
              
              />
              </div>
              <div className='my-5 calender-container'>
                <Calendar/>

              </div>
          </div>
          <div className='col-12 col-xxl-6 '> 
            <div className='profile-emotion-title text-white'>
              <p className='profile-emotion-title-text'>Emotion Graph</p>
            </div>
            <div className='emotion-graph-container'>
              <EmotionGraph data={emotionData} />
            </div>

            <div className='change-happyre-persona'>
              {/* 해피리 페르소나 영역 */}
            </div>

          </div>
          </div>

        </div>  
      </div>
    </div>
  );

}

export default UserProfile;
