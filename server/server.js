const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/privkey.pem')
}, app);

app.use(express.static('public'));

app.get('/webrtc', (req, res) => {
  res.send('WebRTC path accessed');
});

const wss = new WebSocket.Server({ server, path: '/webrtc' });

const MAX_USERS_PER_ROOM = 6;
let rooms = {};

const createNewRoom = () => {
  const roomId = uuidv4();
  rooms[roomId] = [];
  return roomId;
};

const getRoomWithSpace = () => {
  for (let roomId in rooms) {
    if (rooms[roomId].length < MAX_USERS_PER_ROOM) {
      return roomId;
    }
  }
  return createNewRoom();
};

wss.on('connection', (ws, req) => {
  if (req.url !== '/webrtc') {
    ws.close(1008, 'Unauthorized path');
    return;
  }

  const userId = uuidv4();
  const userInfo = { id: userId, connectedAt: Date.now(), coolTime: false, hasMoved: false, position: { x: 0, y: 0 }, characterImage: '' };

  const roomId = getRoomWithSpace();
  rooms[roomId].push({ ws, ...userInfo });

  ws.send(JSON.stringify({ type: 'assign_id', ...userInfo, roomId }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'connect':
        rooms[roomId] = rooms[roomId].map(user => user.id === userId ? { ...user, ...data } : user);
        updateClients(roomId);
        break;

      case 'move':
        rooms[roomId] = rooms[roomId].map(user => user.id === userId ? { ...user, position: data.position, hasMoved: true } : user);
        handleMove(roomId, userId);
        updateClients(roomId);
        break;

      case 'offer':
      case 'answer':
      case 'candidate':
        forwardToRecipient(data, roomId, userId);
        break;

      case 'disconnect':
        removeClient(roomId, userId);
        updateClients(roomId);
        break;

      case 'coolTime':
        rooms[roomId] = rooms[roomId].map(user => user.id === userId ? { ...user, coolTime: data.coolTime } : user);
        updateClients(roomId);
        break;

      default:
        console.error('Unrecognized message type:', data.type);
    }
  });

  ws.on('close', () => {
    removeClient(roomId, userId);
    updateClients(roomId);
  });
});

const handleMove = (roomId, userId) => {
  const movingUser = rooms[roomId].find(user => user.id === userId);
  if (!movingUser) return;

  rooms[roomId].forEach(user => {
    if (user.id !== userId) {
      const distance = calculateDistance(movingUser.position, user.position);
      if (distance <= 0.2 && movingUser.hasMoved && !user.coolTime && !movingUser.coolTime) {
        if (movingUser.connectedAt < user.connectedAt) {
          // movingUser가 오퍼를 보내도록 함
          movingUser.ws.send(JSON.stringify({ type: 'start_webrtc', targetId: user.id, role: 'offer' }));
          user.ws.send(JSON.stringify({ type: 'start_webrtc', targetId: movingUser.id, role: 'answer' }));
        } else {
          user.ws.send(JSON.stringify({ type: 'start_webrtc', targetId: movingUser.id, role: 'offer' }));
          movingUser.ws.send(JSON.stringify({ type: 'start_webrtc', targetId: user.id, role: 'answer' }));
        }
      }
    }
  });
};

const calculateDistance = (pos1, pos2) => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

const updateClients = (roomId) => {
  const allUsers = rooms[roomId].filter(user => user.hasMoved).map(user => ({
    id: user.id,
    position: user.position,
    characterImage: user.characterImage,
    hasMoved: user.hasMoved,
    connectedAt: user.connectedAt,
    coolTime: user.coolTime
  }));

  rooms[roomId].forEach(user => {
    user.ws.send(JSON.stringify({ type: 'update', clients: allUsers.filter(u => u.id !== user.id) }));
  });
};

const forwardToRecipient = (data, roomId, userId) => {
  const recipient = rooms[roomId].find(user => user.id === data.recipient);
  if (recipient) {
    recipient.ws.send(JSON.stringify({ ...data, sender: userId }));
  }
};

const removeClient = (roomId, userId) => {
  rooms[roomId] = rooms[roomId].filter(user => user.id !== userId);
};

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
