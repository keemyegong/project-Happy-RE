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
        <button onClick={playVideo} className='btn user-voice-play-btn'>Play</button>
      </span>}
    </p>

    </div>
  );
};

export default UserResponse;
