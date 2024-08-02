import React, { createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

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

import StarryBackground from './components/starry-background/StarryBackground';
import EmotionGraph from './components/emotion-graph/Test';

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

const AppContent = () => {
  const location = useLocation();

  // 현재 경로가 '/profile'인지 확인
  const isUserProfile = location.pathname === '/profile';

  return (
    <div
      className="App"
      // style={{
      //   overflow: isUserProfile ? 'auto' : 'hidden',
      // }}
    >
      <StarryBackground />
      <Nav />
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
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/with-happyre" element={<PrivateRoute><AIChat /></PrivateRoute>} />
          <Route path="/webrtc" element={<PrivateRoute><RtcClient /></PrivateRoute>} />
          <Route path="/diary" element={<PrivateRoute><Diary /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <universeVariable.Provider
      value={{
        defaultUrl: 'https://i11b204.p.ssafy.io',
        fastUrl: 'http://192.168.31.229:8000',
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </universeVariable.Provider>
  );
};

export default App;
