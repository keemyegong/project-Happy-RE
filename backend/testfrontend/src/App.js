import React from 'react';
import FileUpload from './FileUpload';

function App() {
  return (
    <audio controls autoPlay loop>
      <source src='https://b204testbucket.s3.ap-northeast-2.amazonaws.com/audioset/dancing-under-the-stars-background-music-for-video-vlog-30-second-225250.mp3' type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  );
}

export default App;
