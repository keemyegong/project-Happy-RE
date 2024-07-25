import React, { useState } from 'react';
import './SignUp.css'
import signUpTitle from '../../assets/signup_title.png'
import Button from '../../components/Button/Button';
import UserInfoInput from '../../components/UserInfoInput/UserInfoInput';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate  } from "react-router-dom";

const defaultUrl = 'http://localhost:8080'

const SignUp = () => {
  let navigate = useNavigate ();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const googleSignIn = ()=>{

    window.location.href = `${defaultUrl}/oauth2/authorization/google`
    
  }

  return (
    <div className='signup'>
      <div className='signup-container'>
				<div className='signup-title'>
	      	<img src={signUpTitle} width={450} className='mb-3' />
          <Button className='btn light-btn big' content='Sign Up with Google'
          onClick={googleSignIn}/>
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
				<Button className='btn dark-btn big' content='Sign Up' onClick={()=>{
          if (password !== password2){
            alert('비밀번호가 다릅니다!');
          }else{
            const inputUserInfo = {
              email,
              name:nickname,
              password,
            }

            axios.post(
              `${defaultUrl}/api/user/join`,
              inputUserInfo,
            ).then((Response)=>{
              axios.post(
                `${defaultUrl}/login`,
                {email, password}
              ).then((Response)=>{
                const jwtToken = Response.headers.authorization;
                Cookies.set('Authorization',jwtToken.substr(7), { expires: 30 })
              }).then((Response)=>{
                navigate('/profile');
              })
            })
          }
        }}/>
				
			</div>
    </div>
  );
};

export default SignUp;