import React from 'react';
import './SignUp.css'
import signUpTitle from '../../assets/signup_title.png'

const SignUp = () => {

  return (
    <div className='signup'>
      <div className='signup-container'>
				<div className='signup-title'>
	      	<img src={signUpTitle} height={70} />
				</div>
				<hr className='border-light border-1' />
				<div className='signup-content'>

				</div>
				<hr className='border-light border-1' />
				
			</div>
    </div>
  );
};

export default SignUp;