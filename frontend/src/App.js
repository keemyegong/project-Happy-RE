// App.js
import React,{createContext} from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';


import Nav from './components/navbar/Navbar';
import Main from './pages/main/Main';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import SignUpAgreement from './pages/signup/SignUpAgreement';
import UserTest from './pages/user/UserTest';
import UserUpdate from './pages/userUpdate/UserUpdate';
import AIChat from './pages/aiChat/aiChat';

import StarryBackground from './components/starry-background/StarryBackground';
import EmotionGraph from './components/emotion-graph/Test'


import './App.css';

export const universeVariable = createContext();



// const AppContent = () => {
//   // Navbar가 main일 때는 보이지 않도록 수정
//   const location = useLocation();
//   const showNav = location.pathname !== '/';

//   return (
//     <>
//       <StarryBackground />
//       <div className="content">
//         {showNav && <Nav />}
//         <Routes>
//           <Route path="/" element={<Main />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/usertest" element={<UserTest />} />
//         </Routes>
//       </div>
//     </>
//   );
// };

const App = () => {
  return (
    <universeVariable.Provider value={{
      defaultUrl : 'http://192.168.31.228:8080',
      fastUrl : 'http://192.168.31.229:8000'
      // fastUrl : 'http://localhost:8000'
      // defaultUrl : 'http://localhost:8080',

    }}>
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
              <Route path="/signup/agreement" element={<SignUpAgreement />} />
              <Route path="/user/update" element={<UserUpdate />} />
              <Route path="/aichat" element={<AIChat />} />

            </Routes>
          </div>
        </div>
      </Router>
    </universeVariable.Provider>
  );
};

export default App;
