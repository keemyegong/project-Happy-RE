import React, { useState,useContext } from 'react';
import {universeVariable} from '../../App';
import google from '../../assets/google_login.png'
import kakao from '../../assets/kakao_login.png'
import googleimg from '../../assets/googlelogo.png';
import kakaoimg from '../../assets/kakaologo.png'
import './Login.css';
import { Link } from 'react-router-dom';
import loginTitle from '../../assets/login_title.png'
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'

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
      window.location.reload();    
    }).catch(()=>{
      console.log('Login failed');
      if (email === ''){
        Swal.fire({
          title:"Email이 비어있습니다.",
          icon:"warning",
          iconColor:"#4B4E6D",
          color:"white",
          background:"#292929",
          confirmButtonColor:"#4B4E6D"
        })
      }else if (password === ''){
        Swal.fire({
          title:"Password가 비어있습니다.",
          icon:"warning",
          iconColor:"#4B4E6D",
          color:"white",
          background:"#292929",
          confirmButtonColor:"#4B4E6D"
        })
      }else {
        Swal.fire({
          title:"아이디 혹은 비밀번호가 다릅니다",
          icon:"error",
          iconColor:"#4B4E6D",
          color:"white",
          background:"#292929",
          confirmButtonColor:"#4B4E6D"
        })
      }
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
            <div className='' >
                
                <button className='btn google-login-btn' onClick={googleLogin}>
                  <img className='google-login-logo' src={googleimg}></img>
                  구글 계정으로 로그인
                </button>
            </div>
            <div  >
            <button className='btn kakao-login-btn' onClick={kakaoLogin}>
                <img className='kakao-login-logo' src={kakaoimg}></img>
                  카카오 로그인
                </button>
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