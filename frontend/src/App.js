import logo from './logo.svg';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
function App() {
  const handleLoginSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    const { credential } = credentialResponse;
    const { decode } = jwtDecode(credentialResponse.credential);

    // Google ID 토큰을 백엔드로 전송
    fetch('http://localhost:8080/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token: credential ,

      }),
    })
    .then(response => response.json())
    .then(data => {
      // 백엔드로부터 받은 JWT 토큰 처리
      console.log('JWT Token:', data.token);
      // 이후 토큰을 로컬 스토리지에 저장하거나, 글로벌 상태로 관리
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Google OAuth
        </p>
        <span>
          <GoogleLogin
            onSuccess={ (credentialResponse) =>{
             
              console.log(credentialResponse);
              console.log(jwtDecode(credentialResponse.credential));
              handleLoginSuccess(credentialResponse);
            }}
            onError={()=>{
              console.log("login Failed");
            }}
            />
        </span>
        <a href='https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=b7b48dd2d7bd7d2a07f6c5f15d4883e2&redirect_uri=http://localhost:8080/api/auth/kakao'>
        kakao
        </a>
'

      </header>
    </div>
  );
}

export default App;
