import React, { useEffect, useState, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import defaultImg from '../../assets/characters/default.png';
import CoordinatesGraph from '../../components/ChatGraph/ChatGraph';
import CharacterList from '../../components/CharacterList/CharacterList';
import './ChatRoomContainer.css';

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
  const [hasMoved, setHasMoved] = useState(false);
  const remoteAudioRef = useRef(null);
  const containerRef = useRef(null);

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
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'disconnect' }));
        client.close();
      }
      Object.keys(peerConnections).forEach(key => {
        peerConnections[key].peerConnection.close();
        delete peerConnections[key];
      });
    };
  }, []);

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
      } else if (dataFromServer.type === 'receive_offer') {
        handleOfferRequest(dataFromServer.sender);
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
  }, [position, userImage]);

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
        if (hasMoved && !peerConnections[user.id]) {
          client.send(JSON.stringify({
            type: 'send_offer',
            recipient: user.id
          }));
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
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'connected') {
        console.log(`WebRTC connection established with user ${userId}`);
      }
      if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'closed') {
        console.log('WebRTC 연결이 끊어졌습니다.');
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = null;
        }
        peerConnection.close();
        delete peerConnections[userId];
      }
    };

    if (stream) {
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    }

    return peerConnection;
  };

  const handleOfferRequest = async (sender) => {
    const peerConnection = createPeerConnection(sender);
    peerConnections[sender] = { peerConnection, user: users.find(user => user.id === sender) };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    client.send(JSON.stringify({
      type: 'offer',
      offer: offer.sdp,
      sender: clientId,
      recipient: sender
    }));
  };

  const handleOffer = async (offer, sender) => {
    if (!sender) {
      console.error('No sender provided for offer');
      return;
    }

    if (!peerConnections[sender]) {
      const peerConnection = createPeerConnection(sender);
      peerConnections[sender] = { peerConnection, user: users.find(user => user.id === sender) };
    }

    const peerConnection = peerConnections[sender].peerConnection;
    if (peerConnection.signalingState === 'stable' || peerConnection.signalingState === 'have-local-offer') {
      await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: offer }));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      client.send(JSON.stringify({
        type: 'answer',
        answer: answer.sdp,
        sender: clientId,
        recipient: sender
      }));
    } else {
      console.warn('Attempted to setRemoteDescription in unexpected state:', peerConnection.signalingState);
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
    if (peerConnection.signalingState === 'have-remote-offer') {
      await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answer }));
    } else {
      console.warn('Attempted to setRemoteDescription in unexpected state:', peerConnection.signalingState);
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
    if (peerConnection.signalingState !== 'closed') {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      console.warn('Attempted to addIceCandidate in unexpected state:', peerConnection.signalingState);
    }
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
    setHasMoved(true);
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
      <CoordinatesGraph 
        position={position} 
        users={users} 
        movePosition={movePosition} 
        remoteAudioRef={remoteAudioRef} 
        userImage={userImage} 
      />
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
