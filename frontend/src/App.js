// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './components/navbar/Navbar';
import Main from './pages/main/Main';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import UserTest from './pages/user/UserTest';
import StarryBackground from './components/starry-background/StarryBackground';
import './App.css';

const AppContent = () => {
  // Navbar가 main일 때는 보이지 않도록 수정
  const location = useLocation();
  const showNav = location.pathname !== '/';

  return (
    <>
      <StarryBackground />
      <div className="content">
        {showNav && <Nav />}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/usertest" element={<UserTest />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
};

export default App;
