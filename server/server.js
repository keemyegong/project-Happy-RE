const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/privkey.pem')
}, app);

const wss = new WebSocket.Server({ server });

const kurento = require('kurento-client');
const kurentoUri = 'ws://i11b204.p.ssafy.io:8888/kurento'; // Kurento Media Server 주소
let kurentoClient = null;
let users = [];
let idCounter = 0;

wss.on('connection', (socket) => {
  const userId = idCounter++;
  let userPosition = { id: userId, x: (Math.random() * 2) - 1, y: (Math.random() * 2) - 1, image: null };
  users.push(userPosition);

  socket.send(JSON.stringify({ type: 'assign_id', position: userPosition }));
  broadcast({ users });

  socket.on('message', async (message) => {
    const data = JSON.parse(message);
    if (data.type === 'move') {
      const user = users.find(user => user.id === data.position.id);
      if (user) {
        user.x = data.position.x;
        user.y = data.position.y;
      }
      broadcast({ users });
    }
  });

  socket.on('close', () => {
    users = users.filter(user => user.id !== userId);
    broadcast({ users });
  });
});

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// React 애플리케이션 빌드 파일을 제공
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
