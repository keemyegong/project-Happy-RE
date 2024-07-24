import React from 'react';
import './Login.css'
import { Link } from 'react-router-dom';
import loginTitle from '../../assets/login_title.png'


const Login = () => {

  return (
    <div className='Login'>
      <div className='login-container'>
        <div className='login-title-container'> 
          <div className='login-title'>
            <img width='200px' src={loginTitle}/>
          </div>
        </div>
        

        <div className='login-content-container'>


          <div className='login-sub-content'>

            
            <Link className='password-finder' 
            to={'/password/reset'}>Forgot Password?</Link>

          </div>


        </div>


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