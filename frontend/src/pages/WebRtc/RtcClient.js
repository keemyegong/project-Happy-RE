import React, { useEffect, useState, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import defaultImg from '../../assets/characters/default.png';
import CoordinatesGraph from '../../components/ChatGraph/ChatGraph';
import CharacterList from '../../components/CharacterList/CharacterList';
import AudioEffect from '../../components/audio-api/AudioApi'; // 추가된 부분
import './ChatRoomContainer.css';

const client = new W3CWebSocket('wss://i11b204.p.ssafy.io:5000/webrtc');
const peerConnections = {};

const RtcClient = ({ initialPosition, characterImage }) => {
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const positionRef = useRef(position);
  const [users, setUsers] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [stream, setStream] = useState(null);
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const [userImage, setUserImage] = useState(characterImage || defaultImg);
  const [talkingUsers, setTalkingUsers] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const localAudioRef = useRef(null);
  const containerRef = useRef(null);
  const audioEffectRef = useRef(null); // 추가된 부분

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (window.location.pathname !== '/webrtc') {
      client.close();
      return;
    }

    window.addEventListener('beforeunload', () => {
      client.send(JSON.stringify({ type: 'disconnect' }));
      client.close();
    });

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const movePosition = (dx, dy) => {
    const newPosition = { 
      x: Math.min(1, Math.max(-1, positionRef.current.x + dx)), 
      y: Math.min(1, Math.max(-1, positionRef.current.y + dy)), 
      id: clientId 
    };
    console.log(newPosition)
    setPosition(newPosition);
    setHasMoved(true);
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'move', position: newPosition, hasMoved: true }));
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        movePosition(0, 0.025);
        break;
      case 'ArrowDown':
        movePosition(0, -0.025);
        break;
      case 'ArrowLeft':
        movePosition(-0.025, 0);
        break;
      case 'ArrowRight':
        movePosition(0.025, 0);
        break;
      default:
        break;
    }
  };

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
          characterImage: userImage,
          hasMoved
        }));
      } else if (dataFromServer.type === 'all_users') {
        const filteredUsers = dataFromServer.users.filter(user => user.id !== clientId).map(user => ({
          ...user,
          position: user.position || { x: 0, y: 0 }  // 기본값을 제공
        }));
        setUsers(filteredUsers.map(user => ({
          ...user,
          image: user.characterImage
        })));
        checkDistances(filteredUsers);
      } else if (dataFromServer.type === 'new_user') {
        const newUser = { ...dataFromServer, image: dataFromServer.characterImage, position: dataFromServer.position || { x: 0, y: 0 } };
        setUsers(prevUsers => [...prevUsers, newUser]);
        checkDistances([...users, newUser]);
      } else if (dataFromServer.type === 'move') {
        setUsers(prevUsers => prevUsers.map(user => user.id === dataFromServer.id ? { ...user, position: dataFromServer.position, hasMoved: dataFromServer.hasMoved } : user));
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
      } else if (dataFromServer.type === 'update') {
        setUsers(dataFromServer.clients.map(user => ({
          ...user,
          position: user.position || { x: 0, y: 0 }  // 기본값을 제공
        })));
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
  }, [position, userImage, hasMoved]);

  useEffect(() => {
    if (clientId) {
      checkDistances(users);
    }
  }, [clientId, users]);

  const checkDistances = (currentUsers) => {
    const newNearbyUsers = [];
    const newGroups = {};

    currentUsers.forEach(user => {
      if (user.id === undefined || clientId === null || !user.hasMoved) return;
      const distance = Math.sqrt(Math.pow(user.position.x - position.x, 2) + Math.pow(user.position.y - position.y, 2));
      if (distance <= 0.2 && hasMoved) {
        newNearbyUsers.push(user);

        if (!peerConnections[user.id]) {
          const peerConnection = createPeerConnection(user.id);
          peerConnections[user.id] = { peerConnection };
          if (clientId < user.id) {
            attemptOffer(peerConnection, user.id);
          }
        }

        // 그룹에 속한 유저들과 연결
        newNearbyUsers.forEach(nearbyUser => {
          if (nearbyUser.id !== user.id && !peerConnections[nearbyUser.id]) {
            const peerConnection = createPeerConnection(nearbyUser.id);
            peerConnections[nearbyUser.id] = { peerConnection };
            if (clientId < nearbyUser.id) {
              attemptOffer(peerConnection, nearbyUser.id);
            }
          }
        });

        // 그룹에 추가
        if (!newGroups[user.id]) {
          newGroups[user.id] = [];
        }
        newNearbyUsers.forEach(nearbyUser => {
          if (nearbyUser.id !== user.id && !newGroups[user.id].includes(nearbyUser.id)) {
            newGroups[user.id].push(nearbyUser.id);
          }
        });
      } else if (peerConnections[user.id]) {
        peerConnections[user.id].peerConnection.close();
        delete peerConnections[user.id];
        console.log(`WebRTC connection closed with user ${user.id}`);
      }
    });

    // 그룹 내 연결 처리
    Object.keys(newGroups).forEach(userId => {
      newGroups[userId].forEach(nearbyUserId => {
        if (!peerConnections[nearbyUserId]) {
          const peerConnection = createPeerConnection(nearbyUserId);
          peerConnections[nearbyUserId] = { peerConnection };
          if (clientId < nearbyUserId) {
            attemptOffer(peerConnection, nearbyUserId);
          }
        }
      });
    });

    setNearbyUsers(newNearbyUsers);
  };

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
    console.log('WebRTC 연결 완료');

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
        // AudioEffect에 스트림 추가
        if (audioEffectRef.current) {
          audioEffectRef.current.addStream(userId, event.streams[0]);
        }
      }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        console.log(`WebRTC connection established with user ${userId}`);
      }
      if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'closed') {
        console.log('WebRTC 연결이 끊어졌습니다.');
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = null;
        }
        // ICE 후보 초기화
        if (peerConnections[userId]) {
          delete peerConnections[userId].pendingCandidates;
        }
        // AudioEffect에서도 제거
        if (audioEffectRef.current) {
          audioEffectRef.current.removeStream(userId);
        }
      }
    };

    if (stream) {
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    }

    return peerConnection;
  };

  const attemptOffer = (peerConnection, recipientId) => {
    peerConnection.createOffer()
      .then(offer => {
        peerConnection.setLocalDescription(offer)
          .then(() => {
            client.send(JSON.stringify({
              type: 'offer',
              offer: offer.sdp,
              recipient: recipientId,
              sender: clientId
            }));
          })
          .catch(error => console.error('Error setting local description:', error));
      })
      .catch(error => console.error('Error creating offer:', error));
  };

  const handleOffer = async (offer, sender) => {
    if (!sender) {
      console.error('No sender provided for offer');
      return;
    }

    if (!peerConnections[sender]) {
      const peerConnection = createPeerConnection(sender);
      peerConnections[sender] = { peerConnection };
    }

    const peerConnection = peerConnections[sender].peerConnection;

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offer }));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      client.send(JSON.stringify({
        type: 'answer',
        answer: answer.sdp,
        sender: clientId,
        recipient: sender
      }));

      if (peerConnection.signalingState === 'have-remote-offer') {
        console.log(`Attempted to setRemoteDescription in unexpected state: ${peerConnection.signalingState}`);
      }

    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (answer, sender) => {
    if (!sender) {
      console.error('No sender provided for answer');
      return;
    }

    const connection = peerConnections[sender];
    if (!connection) {
      console.error(`No peer connection found for sender ${sender}`);
      return;
    }
    const peerConnection = connection.peerConnection;

    if (peerConnection.signalingState !== 'have-local-offer') {
      console.error(`Attempted to setRemoteDescription in unexpected state: ${peerConnection.signalingState}`);
      return;
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer }));

    // Add pending ICE candidates if any
    const pendingCandidates = peerConnections[sender].pendingCandidates || [];
    for (const candidate of pendingCandidates) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
    peerConnections[sender].pendingCandidates = [];
  };

  const handleCandidate = async (candidate, sender) => {
    if (!sender) {
      console.error('No sender provided for candidate');
      return;
    }

    const connection = peerConnections[sender];
    if (!connection) {
      console.error(`No peer connection found for sender ${sender}`);
      return;
    }
    const peerConnection = connection.peerConnection;

    if (peerConnection.remoteDescription) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    } else {
      // Save pending ICE candidates
      if (!peerConnections[sender].pendingCandidates) {
        peerConnections[sender].pendingCandidates = [];
      }
      peerConnections[sender].pendingCandidates.push(candidate);
      console.error('Remote description not set yet. ICE candidate cannot be added. Adding to pending candidates.');
    }
  };

  const handleRtcDisconnect = (userId) => {
    if (peerConnections[userId]) {
      peerConnections[userId].peerConnection.close();
      delete peerConnections[userId];
      setNearbyUsers(prev => prev.filter(user => user.id !== userId));
      console.log(`WebRTC connection closed with user ${userId}`);
      // AudioEffect에서도 제거
      if (audioEffectRef.current) {
        audioEffectRef.current.removeStream(userId);
      }
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
        <div className='coordinates-graph-container'>
          <CoordinatesGraph 
            position={position} 
            users={users} 
            movePosition={movePosition} 
            localAudioRef={localAudioRef} 
            userImage={userImage} 
          />
        </div>
        <div className='audio-effect-container'>
          <AudioEffect ref={audioEffectRef} />
        </div>
      <CharacterList 
        nearbyUsers={nearbyUsers} 
        displayStartIndex={displayStartIndex} 
        handleScroll={handleScroll} 
        talkingUsers={talkingUsers} 
      />
    </div>
  );
}

export default RtcClient;
