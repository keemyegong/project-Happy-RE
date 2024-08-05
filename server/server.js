const fs = require('fs');
const https = require('https');
const express = require('express');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

// Express 애플리케이션 생성
const app = express();

// HTTPS 서버 생성
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/privkey.pem')
}, app);

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server, path: '/webrtc' });

let clients = [];

wss.on('connection', function connection(ws, req) {
  if (req.url !== '/webrtc') {
    ws.close();
    return;
  }

  const clientId = uuidv4(); // UUID를 사용하여 고유한 클라이언트 ID 생성
  ws.send(JSON.stringify({ type: 'clientId', id: clientId }));

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if (data.type === 'connect') {
      const client = {
        id: clientId,
        ws: ws,
        position: data.position,
        characterImage: data.characterImage
      };

      clients.push(client);

      // 모든 클라이언트에게 현재 연결된 다른 유저 정보 전송
      clients.forEach(client => {
        const otherClientsData = clients
          .filter(c => c.id !== client.id)
          .map(c => ({
            id: c.id,
            position: c.position,
            characterImage: c.characterImage
          }));

        client.ws.send(JSON.stringify({
          type: 'update',
          clients: otherClientsData
        }));
      });
    }
  });

  ws.on('close', function close() {
    clients = clients.filter(client => client.ws !== ws);

    // 연결이 끊어진 후 업데이트된 클라이언트 정보 전송
    clients.forEach(client => {
      const otherClientsData = clients
        .filter(c => c.id !== client.id)
        .map(c => ({
          id: c.id,
          position: c.position,
          characterImage: c.characterImage
        }));

      client.ws.send(JSON.stringify({
        type: 'update',
        clients: otherClientsData
      }));
    });
  });
});

// HTTPS 서버 리스닝
server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
