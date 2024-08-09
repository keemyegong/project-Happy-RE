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

    window.location.href = `${universal.defaultUrl}/api/oauth2/authorization/google`
    
  }
  const naverLogin = ()=>{
    window.location.href = `${universal.defaultUrl}/api/oauth2/authorization/kakao`
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
      universal.setIsAuthenticated(true);
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
          <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262"><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/></svg>
          <a href="https://www.flaticon.com/free-icons/kakao-talk" title="kakao talk icons">Kakao talk icons created by Fathema Khanom - Flaticon</a>
          <button className='btn google-login-btn ms-0'
          onClick={googleLogin}>Login With Google</button>
          <button className='btn google-login-btn ms-0'
          onClick={naverLogin}>Login With Kakao</button>
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

          <button className='btn login-btn ms-0' onClick={login}>Login</button>
          
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