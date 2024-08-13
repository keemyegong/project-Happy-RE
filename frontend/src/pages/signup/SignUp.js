import React, { useState,useContext } from 'react';
import {universeVariable} from '../../App';
import Swal from 'sweetalert2'

import './SignUp.css'
import signUpTitle from '../../assets/signup_title.png'
import Button from '../../components/Button/Button';
import UserInfoInput from '../../components/UserInfoInput/UserInfoInput';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate  } from "react-router-dom";
 
const SignUp = () => {
  let navigate = useNavigate ();
  const universal = useContext(universeVariable);


  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  return (
    <div className='signup'>
      <div className='signup-container'>
				<div className='signup-title'>
	      	<img src={signUpTitle} width={450} className='mb-3' />
				</div>
				<hr className='border-light border-1' />
				<div className='signup-content'>
          <UserInfoInput isEmail={true} 
          setEmail={setEmail} 
          setNickname={setNickname} 
          setPassword={setPassword} 
          setPassword2={setPassword2}
          />
				</div>
				<hr className='border-light border-1' />
				<Button className='ms-0 btn dark-btn big' content='Sign Up' onClick={()=>{
          if (email === ''){
            Swal.fire({
              title:'Email은 비워둘 수 없습니다!',
              icon:"warning",
              iconColor: "#4B4E6D",
              color: 'white',
              background: '#292929',
              confirmButtonColor: '#4B4E6D',
            })
          } else if (!(email.includes('@')&&email.includes('.'))){
            Swal.fire({
              title:'Email 형식을 지켜주세요!',
              text:"email에는 @와 .이 포함되어야 합니다.",
              icon:"warning",
              iconColor: "#4B4E6D",
              color: 'white',
              background: '#292929',
              confirmButtonColor: '#4B4E6D',
            })
          }
          else if (nickname === ''){
            Swal.fire({
              title:'Nickname은 비워둘 수 없습니다!',
              icon:"warning",
              iconColor: "#4B4E6D",
              color: 'white',
              background: '#292929',
              confirmButtonColor: '#4B4E6D',
            })
          }
          else if (password === ''){
            Swal.fire({
              title:'Password은 비워둘 수 없습니다!',
              icon:"warning",
              iconColor: "#4B4E6D",
              color: 'white',
              background: '#292929',
              confirmButtonColor: '#4B4E6D',
            })
          }
          else if (password !== password2){
            Swal.fire({
              title: '비밀번호가 다릅니다!',
              icon: "warning",
              iconColor: "#4B4E6D",
              color: 'white',
              background: '#292929',
              confirmButtonColor: '#4B4E6D',
            });
          }else{
            const inputUserInfo = {
              email,
              name:nickname,
              password,
            }

            axios.post(
              `${universal.defaultUrl}/api/user/join`,
              inputUserInfo,
            ).then((Response)=>{
              axios.post(
                `${universal.defaultUrl}/api/login`,
                {email, password}
              ).then((Response)=>{
                const jwtToken = Response.headers.authorization;
                Cookies.set('Authorization',jwtToken.substr(7), { expires: 30 })
              }).then((Response)=>{
                universal.setIsAuthenticated(true);
                navigate('/usertest');
              })
            }).catch((error)=>{
              // axios 에러를 잡는 부분(회원가입쪽)
              if (error.response) {
                if (error.response.status === 409) {
                  Swal.fire({
                    icon: 'warning',
                    iconColor: "#4B4E6D",
                    color: 'white',
                    background: '#292929',
                    confirmButtonColor: '#4B4E6D',
                    title: '중복된 아이디입니다',
                    text: '다른 아이디를 사용해 주세요.'
                  });
                } else {
                  Swal.fire({
                    icon: 'error',
                    iconColor: "#4B4E6D",
                    color: 'white',
                    background: '#292929',
                    confirmButtonColor: '#4B4E6D',
                    title: '오류 발생',
                    text: '알 수 없는 오류가 발생했습니다.'
                  });
                }
              } else {
                Swal.fire({
                  icon: 'error',
                  iconColor: "#4B4E6D",
                  color: 'white',
                  background: '#292929',
                  confirmButtonColor: '#4B4E6D',
                  title: '오류 발생',
                  text: '서버와 통신할 수 없습니다.'
                });
              }
            })
          }
        }}/>
				
			</div>
    </div>
  );
};

export default SignUp;