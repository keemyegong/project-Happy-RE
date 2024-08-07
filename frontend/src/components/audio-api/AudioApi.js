import React, { useRef, useEffect } from 'react';
import './AudioApi.css';

const AudioEffect = React.forwardRef((props, ref) => {
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const animationFrameId = useRef(null);
  const canvasRef = useRef(null);
  const streamRefs = useRef({});

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    analyser.current = audioContext.current.createAnalyser();
    analyser.current.fftSize = 2048;
    const bufferLength = analyser.current.frequencyBinCount;
    dataArray.current = new Uint8Array(bufferLength);
    ref.current = {
      addStream,
      removeStream
    };
    draw();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const addStream = (userId, stream) => {
    const source = audioContext.current.createMediaStreamSource(stream);
    source.connect(analyser.current);
    streamRefs.current[userId] = source;
  };

  const removeStream = (userId) => {
    if (streamRefs.current[userId]) {
      streamRefs.current[userId].disconnect();
      delete streamRefs.current[userId];
    }
  };

  const draw = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    analyser.current.getByteTimeDomainData(dataArray.current);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const sliceWidth = WIDTH * 1.0 / analyser.current.fftSize;
    let x = 0;

    for (let i = 0; i < analyser.current.fftSize; i++) {
      const v = dataArray.current[i] / 128.0;
      const y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    animationFrameId.current = requestAnimationFrame(draw);
  };

  return <canvas ref={canvasRef} className="audio-effect-canvas"></canvas>;
});

export default AudioEffect;
