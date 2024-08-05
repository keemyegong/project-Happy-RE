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
  const googleSignIn = ()=>{

    window.location.href = `${universal.defaultUrl}/api/oauth2/authorization/naver`
    
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