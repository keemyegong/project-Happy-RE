import React from 'react';
import MessageCard from './MessageCard';

const test = () => {
  return (
    <div className="App">
      <MessageCard 
        profileImageUrl="" 
        userName="John Doe" 
        content="This is the content of the message card. It can be any text or even other components." 
      />
    </div>
  );
};

export default test;
