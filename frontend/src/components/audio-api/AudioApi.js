import React, { useEffect, useRef } from 'react';
import './AudioApi.css';

const AudioEffect = ({ audioEffectRef }) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
  }, []);

  useEffect(() => {
    audioEffectRef.current = {
      addStream: (stream) => {
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        draw();
      },
      removeStream: () => {
        analyserRef.current.disconnect();
      }
    };
  }, []);

  const draw = () => {
    const canvas = document.querySelector('.audio-visualizer');
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const drawVisualizer = () => {
      requestAnimationFrame(drawVisualizer);
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / dataArrayRef.current.length) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        barHeight = dataArrayRef.current[i];
        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    drawVisualizer();
  };

  return (
    <canvas className="audio-visualizer"></canvas>
  );
};

export default AudioEffect;
