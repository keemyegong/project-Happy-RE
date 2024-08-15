import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { universeVariable } from '../../App';

function Nav() {
  // 토글 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const universal = useContext(universeVariable);
  // 토글 기능
  const toggleNavbar = () => setIsOpen(!isOpen);

  const logout = ()=>{
    window.location.reload();
    Cookies.remove('Authorization',{path:'/'})
    universal.setIsAuthenticated(false);


  }
  // 쿠키에서 JWT 토큰 확인
  useEffect(() => {
    const token = Cookies.get('Authorization');
    if (token == null){
      universal.setIsAuthenticated(false);
    } else{
      universal.setIsAuthenticated(true);
    }
  }, []);

  return (
    <> 
      { universal.isAuthenticated && <nav className="navbar navbar-expand-lg navbar-light" data-bs-theme="dark">
        <div className="container">
          <Link className='navbar-main navbar-brand' style={{ fontSize: '33px' }} to='/'>Happy:RE</Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarNav"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <>
                <li className="nav-item">
                  <Link className='navbar-menu navbar-menu-font' to='/diary'>DIARY</Link>
                </li>
                <li className="nav-item">
                  <Link className='navbar-menu navbar-menu-font' to='/message'>MESSAGE</Link>
                </li>
                <li className="nav-item">
                  <Link className='navbar-menu navbar-menu-font' to='/mindtalking'>TALK</Link>
                </li>
                <li className="nav-item">
                  <Link className='navbar-menu navbar-menu-font' to='/archive'>ARCHIVE</Link>
                </li>
                <li className="nav-item">
                  <Link className='navbar-menu navbar-icon' to='/' onClick={logout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                    </svg>
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className='navbar-menu navbar-icon' to='/profile'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                  </Link>
                </li> */}
              </>
            </ul>
          </div>
        </div>
      </nav>}
    </>
  );
}

export default Nav;
