import React, { useState,useContext, useEffect } from 'react';
import {universeVariable} from '../../App';

import axios from 'axios';
import './UserUpdate.css';
import userProfileImage from '../../assets/sampleUserImage.jpg'
import Button from '../../components/Button/Button';
import UserInfoInput from '../../components/UserInfoInput/UserInfoInput';
import Cookies from 'js-cookie';
import { useNavigate  } from "react-router-dom";

const UserUpdate = ()=>{
  const universal = useContext(universeVariable);
  let navigate = useNavigate ();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  useEffect(()=>{
    axios.get(`${universal.defaultUrl}/api/user/me`,
      {headers: {Authorization : `Bearer ${Cookies.get('Authorization')}`}}
    ).then((Response)=>{
      setNickname(Response.data.name);
    })
  },[])
  return(
    <div className='user-update-container'>
      <h1 className='text-center text-white'>Profile</h1>
      <div className='user-avatar'>
        <img className='profile-image' src={userProfileImage}/>
      </div>
      <div className='user-update-form'>
        <UserInfoInput
        setNickname={setNickname} setPassword={setPassword} setPassword2={setPassword2} nickname={nickname}/>
      </div>
      <Button className='btn dark-btn middle mb-3' content='Update' onClick={()=>{
        if(password!==password2){
          alert('비밀번호가 다릅니다!')
        } else{
          axios.put(
            `${universal.defaultUrl}/api/user/me`,
            {name:nickname,
              password
            },
            {headers: {Authorization : `Bearer ${Cookies.get('Authorization')}`}}
          ).then((Response)=>{
            console.log(Response.data);
            navigate('/profile');

          })
          .catch((err)=>{
            console.log(err);
            
          })
        }
      }} />
      <Button className='btn light-btn middle' content='Sign Out' onClick={()=>{
        axios.delete(
          `${universal.defaultUrl}/api/user/me`,
          {headers: {Authorization : `Bearer ${Cookies.get('Authorization')}`}}
        ).then((Response)=>{
          Cookies.remove('Authorization',{path:'/'});
          navigate('/');
        })
      }} />
    </div>
  );
}

export default UserUpdate;