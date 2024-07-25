import React from 'react';
import './SignUp.css'
import signUpTitle from '../../assets/signup_title.png'
import Button from '../../components/Button/Button';

const SignUp = () => {

  return (
    <div className='signup'>
      <div className='signup-container'>
				<div className='signup-title'>
				
	      	<img src={signUpTitle} width={450} className='mb-3' />
          <Button className='btn light-btn big' content='Sign Up with Google'/>
				</div>
				<hr className='border-light border-1' />
				<div className='signup-content'>

				</div>
				<hr className='border-light border-1' />
				<Button className='btn dark-btn big' content='Sign Up'/>
				
			</div>
    </div>
  );
};

export default SignUp;