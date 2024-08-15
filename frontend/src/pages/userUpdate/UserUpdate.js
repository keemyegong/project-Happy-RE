import React, { useState,useContext, useEffect, useRef } from 'react';
import {universeVariable} from '../../App';
import Swal from 'sweetalert2'

import axios from 'axios';
import './UserUpdate.css';
import userProfileImage from '../../assets/sampleUserImage.jpg'
import Button from '../../components/Button/Button';
import UserInfoInput from '../../components/UserInfoInput/UserInfoInput';
import Cookies from 'js-cookie';
import { useNavigate  } from "react-router-dom";

const UserUpdate = ()=>{

  const [image,setImage] = useState('');
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
      setNickname(Response.data.name);
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
        console.log('이미지 파일이 존재하지 않습니다.')
        setImage(userProfileImage);
      })
    })
  },[])

  const changeUserInfo = ()=>{
    // formData.append('name',nickname);
    // formData.append('password',password);
    if (imagefile){
      formData.append('file',imagefile);
    }
    
    let userInfo = {};

    if(password!==password2){
      Swal.fire({
        title: '비밀번호가 다릅니다!',
        icon: "warning",
        iconColor: "#4B4E6D",
        color: 'white',
        background: '#292929',
        confirmButtonColor: '#4B4E6D',
      });

    } else{
      if (password != null ){
        userInfo = {
          name:nickname,
          password
        };
      } else {
        userInfo = {
          name:nickname
        };
      }

      axios.put(
        `${universal.defaultUrl}/api/user/me`,
        userInfo,
        {
          headers: {
          Authorization : `Bearer ${Cookies.get('Authorization')}`
        }}
      ).then((Response)=>{
        // console.log(Response.data);
        if (imagefile){
          axios.post(
            `${universal.defaultUrl}/api/user/uploadprofile`,
            formData,
            {
              headers: {
              'Content-Type': 'multipart/form-data',
              Authorization : `Bearer ${Cookies.get('Authorization')}`
            }}
          )
        }
      }).then((Response)=>{
        navigate('/profile');
      })
    }
  }

  return(
    <div className='user-update-container'>
      <h1 className='text-center text-white'>Profile</h1>
      <div className='user-avatar'>
        <img className='profile-page-user-image' src={image} onClick={()=>{
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
      <Button className='btn dark-btn middle mb-3 ms-0' content='Update' onClick={changeUserInfo} />
      <Button className='btn light-btn middle ms-0' content='Sign Out' onClick={()=>{
        axios.delete(
          `${universal.defaultUrl}/api/user/me`,
          {headers: {Authorization : `Bearer ${Cookies.get('Authorization')}`}}
        ).then((Response)=>{
          Cookies.remove('Authorization',{path:'/'});
          universal.setIsAuthenticated(false);
          navigate('/');
        })
      }} />
    </div>
  );
}

export default UserUpdate;