import React from 'react';
import './UserInfoInput.css'

const UserInfoInput = (props)=>{
    return(
        <div className='userInfos'>
          {props.isEmail && 
            <div className='form-floating mb-3 '>
              <input type='email' className='login-input form-control' id='Email' placeholder=''
              onChange={(event)=>{
                props.setEmail(event.target.value);
              }}/>
              <label for='Email'>Email</label>
            </div>}
            <div className='form-floating mb-3 '>
              <input type='text' className='login-input form-control' id='nickname' placeholder=''
              onChange={(event)=>{
                props.setNickname(event.target.value);
              }}
              />
              <label for='nickname'>nickname</label>
            </div>
            <div className='form-floating mb-3 '>
              <input type='password' className='login-input form-control' id='password' placeholder=''
              onChange={(event)=>{
                props.setPassword(event.target.value);
              }}/>
              <label for='password'>password</label>
            </div>
            <div className='form-floating mb-3 '>
              <input type='password' className='login-input form-control' id='password2' placeholder=''
              onChange={(event)=>{
                props.setPassword2(event.target.value);
              }}/>
              <label for='password2'>password confirm</label>
            </div>
          
        </div>
    );

}

export default UserInfoInput;
