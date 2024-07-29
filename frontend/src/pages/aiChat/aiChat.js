import React, { useState, useCallback, useContext } from "react";
import {universeVariable} from '../../App';
import Cookies from 'js-cookie';
import MicRecorder from 'mic-recorder-to-mp3';
import './aiChat.css'
import axios from "axios";


const AIChat = () => {

  const universal = useContext(universeVariable);
  const [number, setNumber] = useState(0);

  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [audioUrl, setAudioUrl] = useState();


  const onRecAudio = () => {
    // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);
    setOnRec(false);

    function makeSound(stream) {
      // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    // 마이크 사용 권한 획득
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setStream(stream);
      setMedia(mediaRecorder);
      makeSound(stream);
    });
  };
  
  const offRecAudio = () => {
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    media.ondataavailable = function (e) {
      setAudioUrl(e.data);
      setOnRec(true);
    };

    // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
    stream.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    // 미디어 캡처 중지
    media.stop();
    // 메서드가 호출 된 노드 연결 해제
    analyser.disconnect();
    source.disconnect();
  };

  const downloadAudioFile = useCallback(() => {
  if (audioUrl) {
    const url = URL.createObjectURL(audioUrl);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = 'soundBlob';
    a.click();
    window.URL.revokeObjectURL(url);

  }


}, [audioUrl]);

  const onSubmitAudioFile = useCallback(() => {
    if (audioUrl) {
      // 아래 두 줄 : 재생용 코드
      const audio = new Audio(URL.createObjectURL(audioUrl));
      audio.play();
      console.log(URL.createObjectURL(audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
    }
    // File 생성자를 사용해 파일로 변환
    const sound = new File([audioUrl], `record_${number}.wav`, { lastModified: new Date().getTime(), type: "audio/wav" });
    setNumber(number + 1);

    const formData = new FormData();
    formData.append('file',sound);
    
    axios.post(
      `${universal.fastUrl}/ai-api/emotion/`,
      formData,
      {headers: {
        'Content-Type': 'audio/wav',
        Authorization : `Bearer ${Cookies.get('Authorization')}`

      }}
    ).then((Response)=>{
      console.log(Response.data);
    })
  }, [audioUrl]);

  const recorder = new MicRecorder({
    bitRate: 128
  });

  // mp3 파일 제작용 레코드(녹음시작)
  const newRecord = ()=>{
    recorder.start().then(() => {
    // something else
  }).catch((e) => {
    console.error(e);
  });
  }

  // mp3 파일 제작용 레코드(정지)
  const newRecordStop = ()=>{
    recorder
    .stop()
    .getMp3().
    then(([buffer, blob]) => {
      // do what ever you want with buffer and blob
      // Example: Create a mp3 file and play
      const file = new File(buffer, 'me-at-thevoice.mp3', {
        type: blob.type,
        lastModified: Date.now()
      });
      const player = new Audio(URL.createObjectURL(file));
      player.play();

      const formData = new FormData();
      formData.append('file',file);
      axios.post(
        `${universal.fastUrl}/ai-api/emotion/`,
        formData,
        {headers: {
          'Content-Type': 'audio/mpeg',
          Authorization : `Bearer ${Cookies.get('Authorization')}`
  
        }})

      })
    }


  return (
    <div className='AIChat'>
      <div className="AIChat-continaer">
        <h1 className="text-white">AIChat</h1>
        <h1 className="text-white">{number}</h1>
        <button onClick={onRec ? onRecAudio : offRecAudio}>{onRec? '녹음 시작' : '녹음 중'}</button>
        <button onClick={onSubmitAudioFile}>결과 확인</button>
        <button onClick={downloadAudioFile}>다운로드</button>

        <button onClick={newRecord}>다른 레코드</button>
        <button onClick={newRecordStop}>다른 방식 녹음 끝 + 전송</button>
      </div>
    </div>    
  );


};

export default AIChat;

