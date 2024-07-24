import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Nav() {
  // 토글 상태 관리
  const [isOpen, setIsOpen] = useState(false);

  // 토글 기능
  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar navbar-expand-lg navbar-light" data-bs-theme="dark">
      <div className="container">
        <Link className='navbar-main navbar-brand' style={{fontSize: '33px'}} to='/'>Happy:RE</Link>
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
            <li className="nav-item">
              <Link className='navbar-menu navbar-menu-font' to='/chat'>CHAT</Link>
            </li>
            <li className="nav-item">
              <Link className='navbar-menu navbar-menu-font' to='/diary'>DIARY</Link>
            </li>
            <li className="nav-item">
              <Link className='navbar-menu navbar-menu-font' to='/archive'>ARCHIVE</Link>
            </li>
            <li className="nav-item">
              <Link className='navbar-menu navbar-menu-font' to='/message'>MESSAGE</Link>
            </li>
            <li className="nav-item">
              <Link className='navbar-menu navbar-icon' to='/logout'>LOGOUT</Link>
            </li>
            <li className="nav-item">
              <Link className='navbar-menu navbar-icon' to='/profile'>PROFILE</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
