// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/navbar/Navbar';
import Main from './pages/main/Main';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import UserTest from './pages/user/UserTest';
import UserUpdate from './pages/userUpdate/UserUpdate';
import AIChat from './pages/aiChat/aiChat';

import StarryBackground from './components/starry-background/StarryBackground';
import EmotionGraph from './components/emotion-graph/Test'


import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <StarryBackground />
        <Nav />
        <div className="content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/usertest" element={<UserTest />} />
            <Route path="/emotion" element={<EmotionGraph />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/user/update" element={<UserUpdate />} />
            <Route path="/with-happyre" element={<UserUpdate />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
