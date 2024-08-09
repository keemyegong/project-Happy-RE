import React, { useState,useContext } from 'react';
import {universeVariable} from '../../App';
import kakaoimg from '../../assets/kakaologo.png';
import googleimg from '../../assets/googlelogo.png';
import './Login.css';
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
  const kakaoLogin = ()=>{
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
          <div className='login-logo-container'>
            <div className='google-login-logo'>
              <div className='margin-top'>
                <svg onClick={googleLogin} xmlns="http://www.w3.org/2000/svg" width="1.48em" height="1.5em" viewBox="0 0 256 262"><path fill="white" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="white" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="white" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/><path fill="white" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/></svg>

              </div>
            </div>
            <div className='google-login-logo'>
              <svg onClick={kakaoLogin} xmlns="http://www.w3.org/2000/svg" width="1.9em" height="1.9em" viewBox="0 0 24 24" ><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="white" d="M2 11.5C2 6.643 6.656 3 12 3s10 3.643 10 8.5S17.344 20 12 20q-.789 0-1.546-.1l-2.9 1.932a1 1 0 0 1-1.535-1.028l.445-2.221C3.828 17.09 2 14.517 2 11.5M10 7a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1m1 5.5c0-.221.073-.442.22-.625l2-2.5a1 1 0 0 1 1.56 1.25l-1.5 1.875l1.5 1.875a1 1 0 1 1-1.56 1.25l-2-2.5A1 1 0 0 1 11 12.5"/></g></svg>

            </div>
          </div>
          {/* <img src={googleimg} onClick={googleLogin}alt="Google" style={{ width: '50px', height: '50px' }} />
          <img src={kakaoimg} onClick={kakaoLogin} alt="Kakao" style={{ width: '40px', height: '40px' }} /> */}

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