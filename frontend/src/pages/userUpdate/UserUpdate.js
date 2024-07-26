import React, { useState,useContext, useEffect, useRef } from 'react';
import {universeVariable} from '../../App';

import axios from 'axios';
import './UserUpdate.css';
import userProfileImage from '../../assets/sampleUserImage.jpg'
import Button from '../../components/Button/Button';
import UserInfoInput from '../../components/UserInfoInput/UserInfoInput';
import Cookies from 'js-cookie';
import { useNavigate  } from "react-router-dom";

const UserUpdate = ()=>{

  const [image,setImage] = useState(userProfileImage);
  const [imagefile,setImageFile] = useState();
  const fileInput = useRef(null)

  const universal = useContext(universeVariable);
  let navigate = useNavigate ();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const formData = new FormData();

  const onChange = (e) => {

    if(e.target.files[0]){
      setImageFile(e.target.files[0]);
      
    }else{ 
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.readyState === 2){
        setImage(reader.result);        
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  useEffect(()=>{
    axios.get(`${universal.defaultUrl}/api/user/me`,
      {headers: {Authorization : `Bearer ${Cookies.get('Authorization')}`}}
    ).then((Response)=>{
      console.log(Response.data);
      setNickname(Response.data.name);
    })
  },[])
  return(
    <div className='user-update-container'>
      <h1 className='text-center text-white'>Profile</h1>
      <div className='user-avatar'>
        <img className='profile-image' src={image} onClick={()=>{
          fileInput.current.click()
        }}/>
         <input 
          type='file' 
          style={{display:'none'}}
          accept='image/jpg,impge/png,image/jpeg' 
          name='profile_img'
          onChange={onChange}
          ref={fileInput}/>
      </div>
      <div className='user-update-form'>
        <UserInfoInput
        setNickname={setNickname} setPassword={setPassword} setPassword2={setPassword2} nickname={nickname}/>
      </div>
      <Button className='btn dark-btn middle mb-3' content='Update' onClick={()=>{
        // formData.append('name',nickname);
        // formData.append('password',password);
        if (imagefile){
          formData.append('file',imagefile);
        }

        if(password!==password2){
          alert('비밀번호가 다릅니다!')
        } else{
          axios.put(
            `${universal.defaultUrl}/api/user/me`,
            {
              name:nickname,
              password
            },
            {
              headers: {
              Authorization : `Bearer ${Cookies.get('Authorization')}`
            }}
          ).then((Response)=>{
            console.log(Response.data);
            axios.post(
              `${universal.defaultUrl}/api/user/uploadprofile`,
              formData,
              {
                headers: {
                'Content-Type': 'multipart/form-data',
                Authorization : `Bearer ${Cookies.get('Authorization')}`
              }}
            )
            // navigate('/profile');
          }).then((Response)=>{
            console.log(Response);
            for (var key of formData.entries()) {
              console.log(key[0] + ', ' + key[1]);
            }
          })
          .catch((err)=>{
            console.log(err);
            for (var key of formData.entries()) {
              console.log(key[0] + ', ' + key[1]);
          }
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