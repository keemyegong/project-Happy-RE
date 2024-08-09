import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import './AudioApi.css';

const AudioEffect = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const bufferLengthRef = useRef(null);
  const combinedStreamRef = useRef(new MediaStream());
  const sourceRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    bufferLengthRef.current = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLengthRef.current);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const drawWaveform = () => {
      requestAnimationFrame(drawWaveform);
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'white';
      canvasCtx.beginPath();

      let sliceWidth = canvas.width * 1.0 / bufferLengthRef.current;
      let x = 0;

      for (let i = 0; i < bufferLengthRef.current; i++) {
        let v = dataArrayRef.current[i] / 128.0;
        let y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    drawWaveform();
  }, []);

  useImperativeHandle(ref, () => ({
    addStream: (userId, stream) => {
      stream.getTracks().forEach(track => combinedStreamRef.current.addTrack(track));

      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaStreamSource(combinedStreamRef.current);
        sourceRef.current.connect(analyserRef.current);
      }
    },
    removeStream: (userId) => {
      const tracks = combinedStreamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      combinedStreamRef.current = new MediaStream();

      if (sourceRef.current) {
        sourceRef.current.disconnect(analyserRef.current);
        sourceRef.current = null;
      }

      if (combinedStreamRef.current.getTracks().length === 0) {
        analyserRef.current.disconnect();
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().then(() => {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 2048;
            bufferLengthRef.current = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLengthRef.current);
          });
        }
      }
    }
  }));

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.coordinates-graph-container');
      const canvas = canvasRef.current;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight / 5;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="audio-effect-canvas" />;
});

export default AudioEffect;
