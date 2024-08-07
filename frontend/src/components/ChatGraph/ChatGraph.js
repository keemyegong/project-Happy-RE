// src/components/ChatGraph.js

import React, { useRef, useEffect } from 'react';
import './ChatGraph.css';

const ChatGraph = ({ position = { x: 0, y: 0 }, users = [], movePosition, localAudioRef, userImage }) => {
  const coordinatesGraphRef = useRef(null);

  useEffect(() => {
    const coordinatesGraph = coordinatesGraphRef.current;

    const setHeights = () => {
      if (coordinatesGraph) {
        const width = coordinatesGraph.offsetWidth;
        coordinatesGraph.style.height = `${width}px`;
      }
    };

    setHeights();
    window.addEventListener('resize', setHeights);

    return () => {
      window.removeEventListener('resize', setHeights);
    };
  }, []);

  return (
    <div className="coordinates-graph" ref={coordinatesGraphRef}>
      <div className="axes">
        <div className="x-axis" />
        <div className="y-axis" />
        {[...Array(21)].map((_, i) => (
          <div
            key={`x-tick-${i}`}
            className="x-tick"
            style={{ left: `${(i / 20) * 100}%` }}
          />
        ))}
        {[...Array(21)].map((_, i) => (
          <div
            key={`y-tick-${i}`}
            className="y-tick"
            style={{ top: `${(i / 20) * 100}%` }}
          />
        ))}
        {users.map(user => (
          <div 
            key={user.id}
            className="radar-pulse-small"
            style={{
              left: `calc(${((user.position.x + 1) / 2) * 100}%)`,
              top: `calc(${((1 - user.position.y) / 2) * 100}%)`
            }}
          />
        ))}
        <div className="your-character-container" style={{
            left: `calc(${((position.x + 1) / 2) * 100}%)`,
            top: `calc(${((1 - position.y) / 2) * 100}%)`
          }}>
          <div className="radar-pulse" />
          <img
            src={userImage}
            alt="your character"
            className="character-image your-character"
          />
          <audio ref={localAudioRef} autoPlay />
          <div className="controls controls-up">
            <button onClick={() => movePosition(0, 0.025)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.553 9.224a.5.5 0 0 1 .67.223L8 6.56l5.776 2.888a.5.5 0 1 1-.448-.894l-6-3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1 .223.67"/>
              </svg>
            </button>
          </div>
          <div className="controls controls-right">
            <button onClick={() => movePosition(0.025, 0)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
              </svg>
            </button>
          </div>
          <div className="controls controls-down">
            <button onClick={() => movePosition(0, -0.025)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/>
              </svg>
            </button>
          </div>
          <div className="controls controls-left">
            <button onClick={() => movePosition(-0.025, 0)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-compact-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894-.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGraph;
