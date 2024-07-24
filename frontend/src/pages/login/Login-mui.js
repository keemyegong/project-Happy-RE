import React from 'react';
import './Login.css'
import { Link } from 'react-router-dom';
import loginTitle from '../../assets/login_title.png'

// mui import
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {  ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Typography } from '@mui/material';

// 커스텀 Input 테마 제작
const customTheme = (outerTheme) =>
  createTheme({
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiFilledInput: {
        styleOverrides: {
          root: {
            '&::before, &::after': {
              borderBottom: '0px',
              
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: '0px',
              
            },
            '&.Mui-focused:after': {
              borderBottom: '0px',
              
            },
          },
        },
      },
    },
  });

// 커스텀 로그인 input 제작
const LoginInput = styled(TextField)({
  '& label': {
    color: '#9E9E9E'
  },
  '& label.Mui-focused': {
    color: '#9E9E9E',
  },
  '& .MuiFilledInput-root': { 
    color: '#B2B2B2',
    backgroundColor : '#2A2A2A'
  },

})

// 커스텀 Google Login Button
const GoogleLoginButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius : 12,
  fontSize : 12,
  padding : '20px 12px',
  color: theme.palette.getContrastText('#4B4E6D'),
  backgroundColor: '#4B4E6D',
  '&:hover': {
    backgroundColor: '#717598',
  },
}));

// 커스텀 Login Button
const LoginButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius : 12,
  fontSize : 12,
  padding : '20px 12px',
  color: theme.palette.getContrastText('#4B4E6D'),
  backgroundColor: '#333758',
  '&:hover': {
    backgroundColor: '#54587E',
  },
}));


// 체크박스 label
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Login = () => {
  const outerTheme = useTheme();

  return (
    <div className='Login'>
      <div className='login-container'>
        <div className='login-title-container'> 
          <div className='login-title'>
            <img width='200px' src={loginTitle}/>
          </div>
          <GoogleLoginButton variant='contained' fullWidth='true'>Login with Google</GoogleLoginButton>
        </div>
        
        <Divider sx={{ borderBottomWidth : 0.5 }} color='white' />

        <div className='login-content-container'>
          <ThemeProvider theme={customTheme(outerTheme)}>
            <LoginInput id='E-mail' label='E-mail' fullWidth='true' variant='filled'
            margin='normal' placeholder='email@example.com' autoComplete='false' />

            <LoginInput id='password' type='password' label='password' variant='filled' fullWidth='true'
            margin='normal' placeholder='*******' />
            
          </ThemeProvider>

          <div className='login-sub-content'>
            <FormControlLabel control={<Checkbox defaultChecked
              sx={{
                color: '#4B4E6D',
                '&.Mui-checked': {
                  color: '#4B4E6D',
                },
              }}
              />} 
              label={
                <Typography sx={{
                  fontSize : 12,
                  color:'#f2f2f2',
                }}>
                  Rember ID & PW
                </Typography>
              }
            />
            
            <Link className='password-finder' 
            to={'/password/reset'}>Forgot Password?</Link>

          </div>

          <LoginButton variant='contained' fullWidth='true'>Login</LoginButton>

        </div>

        <Divider sx={{ borderBottomWidth : 0.5 }} color='white' />
        
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