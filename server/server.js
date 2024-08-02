const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const kurento = require('kurento-client');
const path = require('path');

const app = express();
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/privkey.pem')
}, app);

const wss = new WebSocket.Server({ noServer: true });

const ws_uri = 'ws://i11b204.p.ssafy.io:8888/kurento';

kurento(ws_uri, (error, kurentoClient) => {
  if (error) return console.error('Kurento connection error:', error);

  kurentoClient.create('MediaPipeline', (error, pipeline) => {
    if (error) return console.error('MediaPipeline error:', error);

    pipeline.create('WebRtcEndpoint', (error, webRtcEndpoint) => {
      if (error) return console.error('WebRtcEndpoint error:', error);

      console.log('WebRtcEndpoint created successfully');
    });
  });
});

let idCounter = 0;
const users = {};

wss.on('connection', (ws, req) => {
  const userId = idCounter++;
  // 사용자 ID가 이미 존재하는 경우 접속 차단
  if (users[userId]) {
    ws.close(4000, 'Duplicate connection');
    return;
  }

  users[userId] = { id: userId, ws: ws, position: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 } };
  console.log(`User connected: ${userId}`);
  ws.send(JSON.stringify({ type: 'assign_id', position: users[userId].position, id: userId }));

  // 사용자 목록을 전달할 때 현재 사용자를 제외하고 전송
  const otherUsers = Object.values(users).filter(user => user.id !== userId);
  ws.send(JSON.stringify({ type: 'all_users', users: otherUsers.map(user => ({ id: user.id, position: user.position })) }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    console.log(`Received message from user ${userId}:`, data);
    switch (data.type) {
      case 'move':
        handleMove(userId, data.position);
        break;
      case 'offer':
        console.log(`Received offer from user ${userId}`);
        // handleOffer(userId, data); // Kurento 관련 부분 주석 처리
        break;
      case 'candidate':
        console.log(`Received candidate from user ${userId}`);
        // handleCandidate(userId, data.candidate); // Kurento 관련 부분 주석 처리
        break;
      case 'disconnect':
        handleDisconnect(userId);
        break;
    }
  });

  ws.on('close', () => {
    console.log(`User disconnected: ${userId}`);
    handleDisconnect(userId);
  });
});

function handleMove(userId, position) {
  users[userId].position = position;
  broadcast({ users: Object.values(users).filter(user => user.id !== userId).map(user => ({ id: user.id, position: user.position })) });

  const nearbyUsers = getNearbyUsers(userId, 0.2);
  if (nearbyUsers.length > 0) {
    // connectUsers(userId, nearbyUsers[0]); // Kurento 관련 부분 주석 처리
  }
}

function handleDisconnect(userId) {
  delete users[userId];
  broadcast({ type: 'disconnect', id: userId });
}

function getNearbyUsers(userId, distance) {
  const currentUser = users[userId];
  return Object.values(users).filter(user => {
    if (user.id === userId) return false;
    const dx = user.position.x - currentUser.position.x;
    const dy = user.position.y - currentUser.position.y;
    return Math.sqrt(dx * dx + dy * dy) <= distance;
  });
}

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// 정적 파일 서빙 및 모든 경로에 대해 index.html 반환
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// WebSocket 연결 처리
server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url, `https://${request.headers.host}`);
  
  if (pathname === '/webrtc') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
