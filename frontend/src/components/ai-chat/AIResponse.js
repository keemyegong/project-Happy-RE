import React from 'react';
import './Response.css';

const AIResponse = ({ content }) => (
  <div className='ai-response-container'>
    <p className='ai-response'>{content}</p>
  </div>
);

export default AIResponse;
