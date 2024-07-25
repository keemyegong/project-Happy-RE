import React, { useState } from 'react';
import './Login.css'
import { Link } from 'react-router-dom';
import loginTitle from '../../assets/login_title.png'
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import Cookies from 'js-cookie';
// import cookieClient from 'react-cookie';

axios.defaults.withCredentials = true;
const defaultUrl = 'http://192.168.31.228:8080'
function Login() {
  let navigate = useNavigate ();
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginSaved, setIsLoginSaved ]= useState(false);

  const googleLogin = ()=>{
    window.location.href = `${defaultUrl}/oauth2/authorization/google`
  }

  const login = ()=>{
    const inputUserInfo = {
      email,
      password,
    }
    console.log(inputUserInfo);

    axios.post(
      `${defaultUrl}/login`,
      inputUserInfo,
      { withCredentials: true }
    ).then((Response)=>{
      const jwtToken = Response.headers.authorization;
      console.log(jwtToken);
      const decoded = jwtDecode(jwtToken.substr(7));

    }).then((Response)=>{
      navigate('/');
    }).catch(()=>{

      console.log('Login failed');

    }
    )

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
          <button onClick={()=>{
            axios.get(
              `${defaultUrl}/api/user/me`,
              { withCredentials: true,
                headers : {
                  Authorization :'Bearer eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InFxcXFxcXFxcXFxcSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjE4NzA2MzksImV4cCI6MTcyMjA4NjYzOX0.kx5Cyv9v0mE38n9p16tRhwOZq1qlsiYhRA9zEpRHkPU'
                }
               },
              
            ).then((Response)=>{

              console.log(Response);
            })
          }}> test </button>
        </div>
        <hr className='border-light border-1' />


        <div className='go-signup-div'>
          <p>Doesn't have an account?</p>
          <p>
            <Link className='go-signup' to={'/signup'}>Sign Up</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;