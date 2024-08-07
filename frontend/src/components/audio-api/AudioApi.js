import React, { useEffect, useRef } from 'react';
import './AudioApi.css';

const AudioEffect = () => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const bufferLengthRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    bufferLengthRef.current = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLengthRef.current);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    const drawWaveform = () => {
      requestAnimationFrame(drawWaveform);
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

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

    const handleResize = () => {
      const container = document.querySelector('.coordinates-graph-container');
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight / 5;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const audioContext = audioContextRef.current;
    const analyser = analyserRef.current;

    const audioElement = document.querySelector('audio');
    if (audioElement) {
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }
  }, []);

  return <canvas ref={canvasRef} className="audio-effect-canvas" />;
};

export default AudioEffect;
