import React, { createContext, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import bgm from './assets/bgm.mp3';

import Nav from './components/navbar/Navbar';
import Main from './pages/main/Main';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import SignUpAgreement from './pages/signup/SignUpAgreement';
import UserTest from './pages/user/UserTest';
import UserUpdate from './pages/userUpdate/UserUpdate';
import UserProfile from './pages/userProfile/UserProfile';
import AIChat from './pages/aiChat/aiChat';
import RtcClient from './pages/WebRtc/RtcClient';
import Message from './pages/message/Message';
import Diary from './pages/diary/Diary';
import Archive from './pages/archive-page/Archive';

import StarryBackground from './components/starry-background/StarryBackground';
import EmotionGraph from './components/emotion-graph/Test';
import defaultImage from './assets/characters/default.png';

import './App.css';

export const universeVariable = createContext();

const PrivateRoute = ({ children }) => {
  const token = Cookies.get('Authorization');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = Cookies.get('Authorization');
  if (token) {
    return <Navigate to="/profile" />;
  }
  return children;
};

const RestrictUserTestRoute = ({ children }) => {
  const personaNumber = localStorage.getItem("personaNumber");
  if (personaNumber) {
    return <Navigate to="/profile" />;
  }
  return children;
};

const AppContent = ({ setHappyreNumber, withHappyreAccessedToday }) => {
  const location = useLocation();
  const isUserProfile = location.pathname === '/profile';
  const [playing,setPlaying] = useState(false);
  const audioRef = useRef(null);

  const characterImage = defaultImage;

  return (
    <div className="App">
      <StarryBackground />
      <Nav />
      <audio loop preload={true} ref={audioRef} src={bgm}>

      </audio>
      <div onClick={()=>{
        if (playing){
          audioRef.current.pause(); setPlaying(false); audioRef.current.currentTime=0;
        } else{
          audioRef.current.play(); setPlaying(true);
        } 
      }}>
      {!playing &&
      // <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
      // fill="grey" class="bi bi-play-fill" viewBox="0 0 16 16"
      // className='audio-paly-button-main-page'
      // >
      //   <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
      // </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-music-note-beamed" viewBox="0 0 16 16" className='audio-paly-button-main-page'>
        <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
        <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
        <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
      </svg>
      }
      {playing && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" 
      fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16"
      className='audio-paly-button-main-page'>
        <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
      </svg>}
      <p className='audio-paly-button-main-page-label' style={{fontFamily: "Pretendard", fontSize: "15px"}}>Happy:RE MUSIC ON</p>
      
      </div>
      
      <div className="content">
        <Routes>
          <Route path="/" element={<PublicRoute><Main /></PublicRoute>} />
          <Route path="/signin" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/signup/agreement" element={<PublicRoute><SignUpAgreement /></PublicRoute>} />
          <Route path="/emotion" element={<EmotionGraph />} />
          <Route path="/usertest" element={<PrivateRoute><UserTest /></PrivateRoute>} />
          <Route path="/message" element={<PrivateRoute><Message /></PrivateRoute>} />
          <Route path="/user/update" element={<PrivateRoute><UserUpdate /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} setHappyreNumber={setHappyreNumber} />
          {/* <Route path="/with-happyre" element={<PrivateRoute>{withHappyreAccessedToday ? <Navigate to="/profile" /> : <AIChat />}</PrivateRoute>} /> */}
          <Route path="/with-happyre" element={<PrivateRoute><AIChat /></PrivateRoute>}/>
          <Route path="/webrtc"
            element={
              <PrivateRoute>
                <RtcClient
                  characterImage={characterImage}
                />
              </PrivateRoute>
            }/>
          <Route path="/diary" element={<PrivateRoute><Diary /></PrivateRoute>} />
          <Route path="/archive" element={<PrivateRoute><Archive /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todayDone, setTodayDone] = useState(false);
  const [withHappyreAccessedToday, setWithHappyreAccessedToday] = useState(false);

  useEffect(() => {
    const lastAccessDate = Cookies.get('withHappyreAccessDate');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastAccessDate === today) {
      setWithHappyreAccessedToday(true);
    } else {
      Cookies.set('withHappyreAccessDate', today, { expires: 1 });
      setWithHappyreAccessedToday(false);
    }
  }, []);



  return (
    <universeVariable.Provider
      value={{
        defaultUrl: 'https://i11b204.p.ssafy.io',
        // defaultUrl: 'http://192.168.31.216:8080',
        // fastUrl: '',
        fastUrl: 'https://i11b204.p.ssafy.io',
        // fastUrl: 'http://192.168.31.229:8000',
        // defaultUrl: 'http://192.168.31.216:8080',
        // defaultUrl: 'http://192.168.31.48:8080',
        // fastUrl: 'https://i11b204.p.ssafy.io',
        isAuthenticated,
        setIsAuthenticated,
        todayDone,
        setTodayDone,
      }}
    >
      <Router>
        <AppContent withHappyreAccessedToday={withHappyreAccessedToday} />

      </Router>
    </universeVariable.Provider>
  );
};

export default App;
