import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

function Nav() {
  return (
    <div>
      <div className='navbar'>
        <Link className='navbar-menu' to={'/'}>MAIN</Link>
        <Link className='navbar-menu' to={'/chat'}>CHAT</Link>
        <Link className='navbar-menu' to={'/diary'}>DIARY</Link>
        <Link className='navbar-menu' to={'/archive'}>ARCHIVE</Link>
        <Link className='navbar-menu' to={'/message'}>MESSAGE</Link>
        <Link className='navbar-menu' to={'/logout'}>LOGOUT</Link>
        <Link className='navbar-menu' to={'/profile'}>PROFILE</Link>
      </div>
    </div>
  );
}

export default Nav;