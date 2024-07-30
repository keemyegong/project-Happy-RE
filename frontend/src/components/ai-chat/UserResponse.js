import React from 'react';
import './Response.css';

const UserResponse = ({ content }) => (
  <div className='user-response-container'>
    <p className='user-response'>{content}</p>
  </div>
);

export default UserResponse;
