import React from 'react';
import './Response.css';
import axios from 'axios';

const UserResponse = ({ content, isAudio, isRender }) => {

  const playVideo = ()=>{
    console.log('재생');
    axios.get(
      `http://happy-re-test.s3.ap-northeast-2.amazonaws.com/${isAudio}`,
      {responseType:'blob'},
    ).then((Response)=>{
      console.log(Response.data);
      const audioUrl = URL.createObjectURL(new Blob([Response.data]));
      const audio = new Audio(audioUrl);
      audio.play();
    })
  }

  return(
    <div className='user-response-container'>
    <p className='user-response'>{content}
    {isAudio !== '' && isRender && <span>
        <br></br>
        <div className='user-voice-play-btn'>
        <svg
          onClick={playVideo}
          xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
        </svg>
        </div>
        {/* <button onClick={playVideo} className='btn user-voice-play-btn'>PLAY</button> */}
      </span>}
    </p>

    </div>
  );
};

export default UserResponse;
