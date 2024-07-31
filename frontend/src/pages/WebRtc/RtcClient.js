import React, { useEffect, useState, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import art from '../../assets/characters/art.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';
import defaultImg from '../../assets/characters/default.png';
import butler from '../../assets/characters/butler.png';
import './RtcClient.css';

const client = new W3CWebSocket('https://i11b204.p.ssafy.io:5001');
const peerConnections = {}; 
const activeConnections = {};

function RtcClient() {
  const [position, setPosition] = useState({ x: 0, y: 0, id: null });
  const [users, setUsers] = useState([]);
  const [stream, setStream] = useState(null);
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const [userImage, setUserImage] = useState(defaultImg);
  const [talkingUsers, setTalkingUsers] = useState([]);
  const localAudioRef = useRef(null);
  const containerRef = useRef(null);
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

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.type === 'assign_id') {
        const assignedPosition = dataFromServer.position;
        setPosition(assignedPosition);
        setUserImage(getImageForPosition(assignedPosition.x, assignedPosition.y));
      } else if (dataFromServer.users) {
        setUsers(dataFromServer.users.map(user => ({
          ...user,
          image: getImageForPosition(user.x, user.y)
        })));

        handleProximityConnections(dataFromServer.users);
      } else if (dataFromServer.type === 'offer') {
        handleOffer(dataFromServer.offer, dataFromServer.sender);
      } else if (dataFromServer.type === 'answer') {
        handleAnswer(dataFromServer.answer, dataFromServer.sender);
      } else if (dataFromServer.type === 'candidate') {
        handleCandidate(dataFromServer.candidate, dataFromServer.sender);
      } else if (dataFromServer.type === 'talking') {
        setTalkingUsers(dataFromServer.talkingUsers);
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })  // Only request audio
        .then(currentStream => {
          setStream(currentStream);
          if (localAudioRef.current) {
            localAudioRef.current.srcObject = currentStream;
          }
        }).catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      console.error('getUserMedia is not supported in this browser.');
    }
  }, [position]);

  const handleProximityConnections = (allUsers) => {
    const nearbyUsers = allUsers.filter(user => {
      if (user.id === position.id) return false;
      const distance = Math.sqrt(
        Math.pow(user.x - position.x, 2) + Math.pow(user.y - position.y, 2)
      );
      return distance <= 0.2;
    });

    const connectedUsers = Object.keys(peerConnections);

    nearbyUsers.forEach(user => {
      if (!connectedUsers.includes(String(user.id))) {
        const peerConnection = createPeerConnection(user.id);
        peerConnection.createOffer()
          .then(offer => {
            peerConnection.setLocalDescription(offer);
            client.send(JSON.stringify({
              type: 'offer',
              offer: offer,
              recipient: user.id,
              sender: position.id
            }));
          });
        peerConnections[user.id] = peerConnection;
      }
    });

    connectedUsers.forEach(userId => {
      if (!nearbyUsers.find(user => String(user.id) === userId)) {
        peerConnections[userId].close();
        delete peerConnections[userId];
        delete activeConnections[userId];
      }
    });
  };

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:turnserver.example.com', username: 'user', credential: 'pass' }
      ]
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        client.send(JSON.stringify({
          type: 'candidate',
          candidate: event.candidate,
          sender: position.id,
          recipient: userId
        }));
      }
    };

    peerConnection.ontrack = (event) => {
      // Attach the incoming stream to an audio element
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = event.streams[0];
      }
    };

    if (stream) {
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    }

    return peerConnection;
  };

  const handleOffer = async (offer, sender) => {
    const peerConnection = createPeerConnection(sender);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.send(JSON.stringify({
      type: 'answer',
      answer: answer,
      sender: position.id,
      recipient: sender
    }));
    peerConnections[sender] = peerConnection;
  };

  const handleAnswer = async (answer, sender) => {
    const peerConnection = peerConnections[sender];
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleCandidate = async (candidate, sender) => {
    const peerConnection = peerConnections[sender];
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const movePosition = (dx, dy) => {
    const newPosition = { x: Math.min(1, Math.max(-1, position.x + dx)), y: Math.min(1, Math.max(-1, position.y + dy)), id: position.id };
    setPosition(newPosition);
    client.send(JSON.stringify({ type: 'move', position: newPosition }));
  };

  const getImageForPosition = (x, y) => {
    if (x === 0 && y === 0) return defaultImg;
    if (x > 0 && y > 0) return soldier;
    if (x < 0 && y > 0) return art;
    if (x < 0 && y < 0) return steel;
    if (x > 0 && y < 0) return butler;
  };

  const handleScroll = (direction) => {
    if (direction === 'up') {
      setDisplayStartIndex(Math.max(displayStartIndex - 1, 0));
    } else {
      setDisplayStartIndex(Math.min(displayStartIndex + 1, users.length - 4));
    }
  };

  const nearbyUsers = users.filter(user => {
    const distance = Math.sqrt(Math.pow(user.x - position.x, 2) + Math.pow(user.y - position.y, 2));
    return distance <= 0.2;
  });

  return (
    <div className="chat-room-container" ref={containerRef}>
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
                left: `calc(${((user.x + 1) / 2) * 100}%)`,
                top: `calc(${((1 - user.y) / 2) * 100}%)`
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
                    <path fillRule="evenodd" d="M1.553 9.224a.5.5 0 0 1 .67.223L8 6.56l5.776 2.888a.5.5 0 1 1-.448-.894l-6-3a.5.5 0 0 1-.448 0l-6 3a.5.5 0 0 1 .223.67"/>
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
                  <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="right-panel">
        <div className="scroll-buttons">
          <button onClick={() => handleScroll('up')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
            </svg>
          </button>
        </div>
        <div className="character-list">
          <div className={`character-image-small-wrapper ${talkingUsers.includes(position.id) ? 'talking' : ''}`}>
            <img 
              src={userImage} 
              alt="your character"
              className="character-image-small"
            />
          </div>
          {nearbyUsers.slice(displayStartIndex, displayStartIndex + 4).map((user, index) => (
            <div 
              key={user.id}
              className={`character-image-small-wrapper ${talkingUsers.includes(user.id) ? 'talking' : ''}`}
            >
              <img 
                src={user.image} 
                alt="character"
                className="character-image-small"
              />
            </div>
          ))}
        </div>
        <div className="scroll-buttons">
          <button onClick={() => handleScroll('down')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RtcClient;
