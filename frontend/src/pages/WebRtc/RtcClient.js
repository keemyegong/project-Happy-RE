import React, { useEffect, useState, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useLocation } from 'react-router-dom';

const RtcClient = ({ initialPosition, characterImage }) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(null);
  const ws = useRef(null);
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

  const sendPositionUpdate = (position) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'positionUpdate',
        id: clientId,
        position
      }));
    }
  };

  return (
    <div>
      <h1>현재 접속 중인 클라이언트</h1>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            ID: {client.id}, 위치: {client.position}, 캐릭터 이미지: {client.characterImage}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RtcClient;
