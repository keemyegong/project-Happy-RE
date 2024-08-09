import { w3cwebsocket as W3CWebSocket } from "websocket";
import React, { useEffect, useState, useRef } from 'react';
import defaultImg from '../../assets/characters/default.png';
import CoordinatesGraph from '../../components/ChatGraph/ChatGraph';
import CharacterList from '../../components/CharacterList/CharacterList';
import AudioEffect from '../../components/audio-api/AudioApi';
import artist from '../../assets/characters/art.png';
import butler from '../../assets/characters/butler.png';
import defaultPersona from '../../assets/characters/default.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';

import './ChatRoomContainer.css';

const client = new W3CWebSocket('wss://i11b204.p.ssafy.io:5000/webrtc');

const RtcClient = ({ initialPosition, characterImage }) => {
  const [peerConnections, setPeerConnections] = useState({});
  const happyRelist = [defaultPersona, soldier, butler, steel, artist];
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
  const [coolTime, setCoolTime] = useState(false);
  const localAudioRef = useRef(null);
  const containerRef = useRef(null);
  const audioEffectRef = useRef(null);

  useEffect(() => {
    positionRef.current = position;
    console.log(`CoolTime state: ${coolTime}`);
  }, [position, coolTime]);

  useEffect(() => {
    if (window.location.pathname !== '/webrtc') {
      client.close();
      return;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      client.close();
    };
  }, []);

  useEffect(() => {
    setUserImage(happyRelist[localStorage.getItem("personaNumber")]);
  },[]);

  const handleBeforeUnload = () => {
    client.send(JSON.stringify({ type: 'disconnect' }));
    client.close();
    cleanupConnections();
  };

  const cleanupConnections = () => {
    Object.values(peerConnections).forEach(({ peerConnection }) => {
      peerConnection.close();
    });
    setPeerConnections({});
    if (audioEffectRef.current) {
      Object.keys(peerConnections).forEach(userId => {
        audioEffectRef.current.removeStream(userId);
      });
    }
    checkAndSetCoolTime();
  };

  const checkAndSetCoolTime = () => {
    if (Object.keys(peerConnections).length === 0) {
      setCoolTime(true);
      client.send(JSON.stringify({ type: 'coolTime', coolTime: true }));
      console.log('All connections closed, setting CoolTime to true');
      setTimeout(() => {
        setCoolTime(false);
        client.send(JSON.stringify({ type: 'coolTime', coolTime: false }));
        console.log('CoolTime reset to false after 10 seconds');
      }, 10000);
    }
  };

  const movePosition = (dx, dy) => {
    const newPosition = {
      x: Math.min(1, Math.max(-1, positionRef.current.x + dx)),
      y: Math.min(1, Math.max(-1, positionRef.current.y + dy)),
      id: clientId
    };
    setPosition(newPosition);
    setHasMoved(true);
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'move', position: newPosition, hasMoved: true }));
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        movePosition(0, 0.005);
        break;
      case 'ArrowDown':
        movePosition(0, -0.005);
        break;
      case 'ArrowLeft':
        movePosition(-0.005, 0);
        break;
      case 'ArrowRight':
        movePosition(0.005, 0);
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
          hasMoved,
          coolTime
        }));
      } else if (dataFromServer.type === 'all_users') {
        const filteredUsers = dataFromServer.users.filter(user => user.id !== clientId).map(user => ({
          ...user,
          position: user.position || { x: 0, y: 0 },
          coolTime: user.coolTime || false
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
        setUsers(prevUsers => prevUsers.map(user => user.id === dataFromServer.id ? { ...user, position: dataFromServer.position, hasMoved: dataFromServer.hasMoved, coolTime: dataFromServer.coolTime } : user));
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
          position: user.position || { x: 0, y: 0 },
          coolTime: user.coolTime || false
        })));
      } else if (dataFromServer.type === 'coolTime') {
        setCoolTime(dataFromServer.coolTime);
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
  }, [position, userImage, hasMoved, coolTime]);

  useEffect(() => {
    if (clientId) {
      checkDistances(users);
    }
  }, [clientId, users]);

  const checkDistances = (currentUsers) => {
    const newNearbyUsers = [];
  
    currentUsers.forEach(user => {
      if (user.id === undefined || clientId === null || !user.hasMoved) return;
      const distance = Math.sqrt(Math.pow(user.position.x - position.x, 2) + Math.pow(user.position.y - position.y, 2));
      if (distance <= 0.2 && hasMoved) {
        newNearbyUsers.push(user);
  
        if (!peerConnections[user.id] && !coolTime) {
          const peerConnection = createPeerConnection(user.id);
          setPeerConnections(prevConnections => ({
            ...prevConnections,
            [user.id]: { peerConnection }
          }));
          if (clientId < user.id) {
            attemptOffer(peerConnection, user.id);
          }
        }
      } else if (peerConnections[user.id]) {
        peerConnections[user.id].peerConnection.close();
        setPeerConnections(prevConnections => {
          const updatedConnections = { ...prevConnections };
          delete updatedConnections[user.id];
          return updatedConnections;
        });
        if (audioEffectRef.current) {
          audioEffectRef.current.removeStream(user.id);
        }
        console.log(`WebRTC connection closed with user ${user.id}`);
        checkAndSetCoolTime();
      }
    });
  
    setNearbyUsers(newNearbyUsers);
  };

  const createPeerConnection = (userId) => {
    if (coolTime) return null;  // coolTime이 true일 때 연결 시도하지 않음

    const peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    });
    console.log('WebRTC 연결 완료');

    peerConnections[userId] = { peerConnection, pendingCandidates: [] };

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
    if (coolTime || !peerConnection) return;

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
  
    const peerConnection = resetPeerConnection(sender);
  
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
  
      if (peerConnections[sender]?.pendingCandidates.length > 0) {
        for (const candidate of peerConnections[sender].pendingCandidates) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        setPeerConnections(prevConnections => ({
          ...prevConnections,
          [sender]: {
            ...prevConnections[sender],
            pendingCandidates: []
          }
        }));
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
  
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer }));
      // Add pending ICE candidates if any
      if (peerConnections[sender]?.pendingCandidates.length > 0) {
        for (const candidate of peerConnections[sender].pendingCandidates) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        peerConnections[sender].pendingCandidates = [];
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
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
  
    if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    } else {
      setPeerConnections(prevConnections => {
        const newPendingCandidates = (prevConnections[sender]?.pendingCandidates || []).concat(candidate);
        return {
          ...prevConnections,
          [sender]: {
            ...prevConnections[sender],
            pendingCandidates: newPendingCandidates
          }
        };
      });
      console.error('Remote description not set yet. ICE candidate cannot be added. Adding to pending candidates.');
    }
  };

  const handleRtcDisconnect = (userId) => {
    if (peerConnections[userId]) {
      peerConnections[userId].peerConnection.close();
      setPeerConnections(prevConnections => {
        const { [userId]: removedConnection, ...restConnections } = prevConnections;
        return restConnections;
      });
      setNearbyUsers(prev => prev.filter(user => user.id !== userId));
      console.log(`WebRTC connection closed with user ${userId}`);
      // AudioEffect에서도 제거
      if (audioEffectRef.current) {
        audioEffectRef.current.removeStream(userId);
      }
      checkAndSetCoolTime();
    }
  };

  const resetPeerConnection = (userId) => {
    if (peerConnections[userId]) {
      peerConnections[userId].peerConnection.close();
    }
  
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    });
  
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
        if (audioEffectRef.current) {
          audioEffectRef.current.addStream(userId, event.streams[0]);
        }
      }
    };
  
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        console.log(`WebRTC connection established with user ${userId}`);
      } else if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'closed') {
        console.log('WebRTC 연결이 끊어졌습니다.');
        if (localAudioRef.current) {
          localAudioRef.current.srcObject = null;
        }
        if (audioEffectRef.current) {
          audioEffectRef.current.removeStream(userId);
        }
      }
    };
  
    setPeerConnections(prevConnections => ({
      ...prevConnections,
      [userId]: { peerConnection, pendingCandidates: [] }
    }));
  
    if (stream) {
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    }
  
    return peerConnection;
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
            coolTime={coolTime} // 추가된 부분
          />
        </div>
        <div className='audio-effect-container'>
          <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12%" height="25%" fill="currentColor" class="audio-effect-icon bi bi-volume-up-fill" viewBox="0 0 16 16">
            <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z"/>
            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z"/>
            <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06"/>
          </svg>
          </span>
          <AudioEffect ref={audioEffectRef} />
        </div>
      <CharacterList 
        nearbyUsers={nearbyUsers} 
        displayStartIndex={displayStartIndex} 
        handleScroll={handleScroll} 
        talkingUsers={talkingUsers} 
        coolTime={coolTime}
      />
    </div>
  );
}

export default RtcClient;
