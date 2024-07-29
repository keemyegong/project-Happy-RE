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
    { text: 'duck', value: 10 },
  ]

  const [image,setImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [words, setWords] = useState('');
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
      <div className='row'>
        <div className='col-12 col-md-4 col-xxl-2 default-info'>
          <div className='user-avatar'>
            <img className='profile-image' src={image}/>
          </div>
          <div className='default-info-container'>
            <p className='nickname'>{nickname}</p>
            <p className='email'>{email}</p>
            <Button className='btn dark-btn small' content='Edit Profile' onClick={()=>{
              navigate('/user/update')
            }} />

          </div>
        </div>
        <div className='col-12 col-md-8 col-xxl-10'>
          <div className='row'>
          <div className='col-12 col-xxl-6'> 
            <h3 className='text-white'>My Words</h3>
            <hr className='border-light border-1'></hr>
            <div className='wordcloud-container'>
            <WordCloud 
              data={data}
              width={500}
              height={200}
              font="Times"
              fontWeight="bold"
              fontSize={(word) => Math.log2(word.value) * 5}
              spiral="rectangular"
              rotate={(word) => (word.value*100)% 360}
              padding={5}
              random={Math.random}
              fill={(d, i) => schemeCategory10ScaleOrdinal(i)}
              
              />
              </div>
          </div>
          <div className='col-12 col-xxl-6'> 
            <h3 className='text-white'>Emotion Graph</h3>
            <hr className='border-light border-1'></hr>

          </div>
          </div>

        </div>  
      </div>
    </div>
  );

}

export default UserProfile;
