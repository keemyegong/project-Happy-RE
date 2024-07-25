import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Nav from './components/navbar/Navbar';
import Main from './pages/main/Main';
import Login from './pages/login/Login';
import UserTest from './pages/user/UserTest';
import StarryBackground from './components/starry-background/StarryBackground';
import EmotionGraph from './components/emotion-graph/Test'
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <StarryBackground />
        <div className="content">
          <Nav />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/usertest" element={<UserTest />} />
            <Route path="/emotion" element={<EmotionGraph />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
