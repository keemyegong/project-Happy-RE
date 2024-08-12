import React, {useEffect,useState, useRef} from 'react';
import './Response.css';
import axios from 'axios';

const UserResponse = ({ content, isAudio, isRender }) => {
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);


  useEffect(()=>{
    if (isAudio !== '' && isAudio!==null  && isRender ){
      getVideo();
    }
  },[])

  const getVideo = ()=>{
    console.log('재생');
    axios.get(
      `http://happy-re-test.s3.ap-northeast-2.amazonaws.com/${isAudio}`,
      {responseType:'blob'},
    ).then((Response)=>{
      console.log(Response.data);
      const audioUrl = URL.createObjectURL(new Blob([Response.data]));
      audio.current = new Audio(audioUrl);
      // audio.play();
    })
  }

  const playVideo = ()=>{
    setPlaying(true);
    audio.current.play();
  }

  const stopVideo = ()=>{
    setPlaying(false);
    console.log(audio);
    console.log('stop');
    audio.current.pause();
    audio.current.currentTime = 0;
  }

  return(
    <div className='user-response-container'>
    <p className='user-response'>{content}
    {(isAudio !== '' && isAudio!==null ) && isRender && <span>
        <br></br>
        <div className='user-voice-play-btn'>
        {!playing && <svg
          onClick={playVideo}
          xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
        </svg>}
        {playing && <svg
        onClick={stopVideo}
         xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
        </svg>}
        </div>
      </span>}
    </p>

    </div>
  );
};

export default UserResponse;
