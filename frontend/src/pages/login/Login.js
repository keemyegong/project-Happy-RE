import React, { useState,useContext } from 'react';
import {universeVariable} from '../../App';

import './Login.css'
import { Link } from 'react-router-dom';
import loginTitle from '../../assets/login_title.png'
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import Cookies from 'js-cookie';

axios.defaults.withCredentials = true;

function Login() {
  const universal = useContext(universeVariable);
  let navigate = useNavigate ();
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginSaved, setIsLoginSaved ]= useState(false);

  const googleLogin = ()=>{

    window.location.href = `${universal.defaultUrl}/api/oauth2/authorization/naver`
    
  }

  const login = ()=>{
    const inputUserInfo = {
      email,
      password,
    }

    axios.post(
      `${universal.defaultUrl}/api/login`,
      inputUserInfo,
    ).then((Response)=>{
      const jwtToken = Response.headers.authorization;
      if (isLoginSaved){
        Cookies.set('Authorization',jwtToken.substr(7), { expires: 30 })
      } else {
        Cookies.set('Authorization', jwtToken.substr(7));

      }
      
    }).then((Response)=>{
      navigate('/profile');
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
            to={'/password/reset'}> </Link>

          </div>

          <button className='btn login-btn' onClick={login}>Login</button>
          
        </div>
        <hr className='border-light border-1' />


        <div className='go-signup-div'>
          <p>Doesn't have an account?</p>
          <p>
            <Link className='go-signup' to={'/signup/agreement'}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;