import React, { useState } from 'react';
import './Login.css'
import { Link } from 'react-router-dom';
import loginTitle from '../../assets/login_title.png'
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


axios.defaults.withCredentials = true;

function Login() {

  let navigate = useNavigate ();
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginSaved, setIsLoginSaved ]= useState(false);

  const googleLogin = ()=>{
    axios.post(
      window.location.href = "http://localhost:8080/oauth2/authorization/naver"
    ).then((response)=>{
      console.log(response);
      console.log('aaa');
    })

  }

  const login = ()=>{
    const inputUserInfo = {
      email,
      password,
    }
    console.log(inputUserInfo);

    axios.post(
      'http://192.168.31.228:8080/login',
      inputUserInfo,
      { withCredentials: true }
    ).then((Response)=>{
      console.log("Response :  ",Response)



    }).then((Response)=>{
      navigate('/');
    })

  }

  const me = ()=>{
    axios.get(
      'http://192.168.31.228:8080/api/user/me',
      { withCredentials: true }
    ).then((Response)=>{
      console.log("Server response:");
      console.log(Response.data); // 서버 응답 본문 출력

      // 응답 객체 전체를 출력합니다
      console.log("Full response object:");
      console.log(Response); // 응답 객체 전체 출력


    }).then((Response)=>{
      navigate('/');
    })


  }

  return (
    <div className='Login'>
      <div className='login-container'>
        <div className='login-title-container'> 
          <div className='login-title'>
            <img width='200px' src={loginTitle}/>
          </div>
          <button className='btn google-login-btn'
          onClick={googleLogin}>Login With Google</button>
        </div>

        <hr className='border-light border-1' />
      
        <div className='login-content-container'>
          <div className='form-floating mb-3'>
            <input type='email' className='login-input form-control' id='email' placeholder='name@example.com'
            onChange={(event)=>{
              setEmail(event.target.value);
            }}
            />
            <label for='email'>Email address</label>
          </div>
          <div className='form-floating mb-3 '>
            <input type='password' className='login-input form-control' id='password' placeholder=''
            onChange={(event)=>{
              setPassword(event.target.value);
            }}/>
            <label for='password'>Password</label>
          </div>
          
          <div className='login-sub-content mb-3'>

            <div className='checkbox-container'>
              <input className='form-check-input custom-checkbox' type='checkbox' value='' id='login-save'
              onChange={()=>{
                setIsLoginSaved(!isLoginSaved);
              }}/>
              <label className='form-check-label checkbox-label' for='login-save'>
                Remember ID & Password
              </label>
            </div>
            <Link className='password-finder' 
            to={'/password/reset'}>Forgot Password?</Link>

          </div>

          <button className='btn login-btn' onClick={login}>Login</button>
          <button className='btn login-btn' onClick={me}>test</button>
        </div>
        <hr className='border-light border-1' />


        <div className='go-signup-div'>
          <p>Doesn't have an account?</p>
          <p>
            <Link className='go-signup' to={'/signup'}>Sign Up</Link>
          </p>
          <button className='btn login-btn' onClick={me}>test</button>
        </div>

      </div>
    </div>
  );
};

export default Login;