import React from 'react';
import './Login.css'
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import loginTitle from '../../assets/login_title.png'

import { ThemeProvider, THEME_ID, createTheme } from '@mui/material/styles';

const materialTheme = createTheme({palette: {type: "dark"}});

const Login = () => {
  return (
    <div className='Login'>
      <div class='login-container'>
        <Typography variant="h2" gutterBottom>
          WELCOME!
        </Typography>
        <img src={loginTitle}/>

        <Divider />

        <TextField id='E-mail' label='E-mail' variant='filled' fullWidth='true'
        margin='normal' placeholder='email@example.com'  />

        <TextField id='password' type='password' label='password' variant='filled' fullWidth='true'
        margin='normal' placeholder='*******' />

      </div>
    </div>
  );
};

export default Login;