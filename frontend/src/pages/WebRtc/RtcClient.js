import React, { useEffect, useState, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import kurentoUtils from 'kurento-utils';
import art from '../../assets/characters/art.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';
import defaultImg from '../../assets/characters/default.png';
import butler from '../../assets/characters/butler.png';
import './RtcClient.css';

const client = new W3CWebSocket('wss://i11b204.p.ssafy.io:5000/webrtc');
const peerConnections = {};

const RtcClient = ({ initialPosition, characterImage }) => {
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [users, setUsers] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [stream, setStream] = useState(null);
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const [userImage, setUserImage] = useState(characterImage || defaultImg);
  const [talkingUsers, setTalkingUsers] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const localAudioRef = useRef(null);
  const containerRef = useRef(null);
  const coordinatesGraphRef = useRef(null);

  useEffect(() => {
    if (window.location.pathname !== '/webrtc') {
      client.close();
      return;
    }

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
    if (window.location.pathname !== '/webrtc') return;

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };

    client.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      if (dataFromServer.type === 'assign_id') {
        setClientId(dataFromServer.id);
        client.send(JSON.stringify({
          type: 'connect',
          position,
          characterImage: userImage
        }));
      } else if (dataFromServer.type === 'all_users') {
        const filteredUsers = dataFromServer.users.filter(user => user.id !== clientId);
        setUsers(filteredUsers.map(user => ({
          ...user,
          image: user.characterImage
        })));
        checkDistances(filteredUsers);
      } else if (dataFromServer.type === 'new_user') {
        const newUser = { ...dataFromServer, image: dataFromServer.characterImage };
        setUsers(prevUsers => [...prevUsers, newUser]);
        checkDistances([...users, newUser]);
      } else if (dataFromServer.type === 'move') {
        setUsers(prevUsers => prevUsers.map(user => user.id === dataFromServer.id ? { ...user, position: dataFromServer.position } : user));
        checkDistances(users);
      } else if (dataFromServer.type === 'offer') {
        handleOffer(dataFromServer.offer, dataFromServer.sender);
      } else if (dataFromServer.type === 'answer') {
        handleAnswer(dataFromServer.answer, dataFromServer.sender);
      } else if (dataFromServer.type === 'candidate') {
        handleCandidate(dataFromServer.candidate, dataFromServer.sender);
      } else if (dataFromServer.type === 'rtc_disconnect') {
        handleRtcDisconnect(dataFromServer.id);
      } else if (dataFromServer.type === 'talking') {
        setTalkingUsers(dataFromServer.talkingUsers);
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(currentStream => {
          setStream(currentStream);
        }).catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      console.error('getUserMedia is not supported in this browser.');
    }

    return () => {
      // 주석 처리된 부분 시작
      // client.send(JSON.stringify({ type: 'disconnect' }));
      // client.close();
      // 주석 처리된 부분 끝
    };
  }, [position, userImage]); // 의존성 배열에 position과 userImage 추가

  useEffect(() => {
    if (clientId) {
      checkDistances(users);
    }
  }, [clientId, users]);

  const checkDistances = (currentUsers) => {
    const newNearbyUsers = [];
    currentUsers.forEach(user => {
      if (user.id === undefined || clientId === null) return;
      const distance = Math.sqrt(Math.pow(user.position.x - position.x, 2) + Math.pow(user.position.y - position.y, 2));
      if (distance <= 0.2) {
        newNearbyUsers.push(user);
        if (!peerConnections[user.id]) {
          const peerConnection = createPeerConnection(user.id);
          peerConnection.createOffer()
            .then(offer => {
              peerConnection.setLocalDescription(offer);
              client.send(JSON.stringify({
                type: 'offer',
                offer: offer.sdp,  // 문자열로 변환
                recipient: user.id,
                sender: clientId
              }));
            });
          peerConnections[user.id] = { peerConnection, user };
        }
      } else if (peerConnections[user.id]) {
        peerConnections[user.id].peerConnection.close();
        delete peerConnections[user.id];
        console.log(`WebRTC connection closed with user ${user.id}`);
      }
    });
    setNearbyUsers(newNearbyUsers);
  };

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    console.log('webrtc 연결완료');

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        client.send(JSON.stringify({
          type: 'candidate',
          candidate: event.candidate,
          sender: clientId,
          recipient: userId
        }));
      }
    };

    peerConnection.ontrack = (event) => {
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'closed') {
        console.log('WebRTC 연결이 끊어졌습니다.');
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = null;
        }
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
      answer: answer.sdp,  // 문자열로 변환
      sender: clientId,
      recipient: sender
    }));
    peerConnections[sender] = { peerConnection, user: users.find(user => user.id === sender) };
  };

  const handleAnswer = async (answer, sender) => {
    const peerConnection = peerConnections[sender].peerConnection;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleCandidate = async (candidate, sender) => {
    const peerConnection = peerConnections[sender].peerConnection;
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const handleRtcDisconnect = (userId) => {
    if (peerConnections[userId]) {
      peerConnections[userId].peerConnection.close();
      delete peerConnections[userId];
      setNearbyUsers(prev => prev.filter(user => user.id !== userId));
      console.log(`WebRTC connection closed with user ${userId}`);
    }
  };

  const movePosition = (dx, dy) => {
    const newPosition = { x: Math.min(1, Math.max(-1, position.x + dx)), y: Math.min(1, Math.max(-1, position.y + dy)), id: clientId };
    setPosition(newPosition);
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'move', position: newPosition }));
    }
  };

  const handleScroll = (direction) => {
    if (direction === 'up') {
      setDisplayStartIndex(Math.max(displayStartIndex - 1, 0));
    } else {
      setDisplayStartIndex(Math.min(displayStartIndex + 1, nearbyUsers.length - 4));
    }
  };

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
      <div className="right-panel">
        <div className="scroll-buttons">
          <button onClick={() => handleScroll('up')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" fill="currentColor" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448-.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
            </svg>
          </button>
        </div>
        <div className="character-list">
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
