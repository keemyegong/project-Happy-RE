import React, { useEffect, useState, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useLocation } from 'react-router-dom';
import kurentoUtils from 'kurento-utils';

const RtcClient = ({ initialPosition, characterImage }) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(null);
  const ws = useRef(null);
  const webRtcPeer = useRef(null);
  const remoteAudio = useRef(null); // Remote audio element
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/webrtc') {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        ws.current = new W3CWebSocket('wss://i11b204.p.ssafy.io:5000/webrtc');

        ws.current.onopen = () => {
          console.log('WebSocket connection opened');
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === 'clientId') {
            setClientId(data.id);
            ws.current.send(JSON.stringify({
              type: 'connect',
              position: initialPosition,
              characterImage
            }));
          }

          if (data.type === 'update') {
            setClients(data.clients);
          }

          if (data.type === 'answer') {
            webRtcPeer.current.processAnswer(data.sdpAnswer);
          }

          if (data.type === 'candidate') {
            webRtcPeer.current.addIceCandidate(data.candidate);
          }
        };

        ws.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
      }
    } else {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    }
  }, [location.pathname, initialPosition, characterImage]);

  useEffect(() => {
    if (clientId) {
      const options = {
        mediaConstraints: { audio: true, video: false },
        onicecandidate: (candidate) => {
          ws.current.send(JSON.stringify({
            type: 'candidate',
            candidate: candidate
          }));
        },
        onaddstream: (event) => {
          console.log('Remote stream added:', event.stream);
          if (remoteAudio.current) {
            remoteAudio.current.srcObject = event.stream;
          }
        }
      };

      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
          options.localStream = stream;

          webRtcPeer.current = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, (error) => {
            if (error) return console.error(error);

            webRtcPeer.current.generateOffer((error, sdpOffer) => {
              if (error) return console.error(error);

              ws.current.send(JSON.stringify({
                type: 'offer',
                sdpOffer: sdpOffer
              }));
            });
          });
        })
        .catch(error => {
          console.error('Error accessing media devices:', error);
        });
    }

    // 컴포넌트 언마운트 시 WebRTC 피어 연결을 끊는 부분 제거
    // return () => {
    //   if (webRtcPeer.current) {
    //     webRtcPeer.current.dispose();
    //   }
    // };
  }, [clientId]);

  return (
    <div>
      <h1>현재 접속 중인 클라이언트</h1>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            ID: {client.id}, 위치: ({client.position.x}, {client.position.y}), 캐릭터 이미지: {client.characterImage}
          </li>
        ))}
      </ul>
      <audio ref={remoteAudio} autoPlay /> {/* Remote audio element */}
    </div>
  );
};

export default RtcClient;
