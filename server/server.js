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
  const userInfo = { id: userId, connectedAt: Date.now(), coolTime: false, hasMoved: false, position: { x: 0, y: 0 }, characterImage: '', connectedUsers: [] };

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
        handleMove(roomId, userId, data.position);
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

      default:
        console.error('Unrecognized message type:', data.type);
    }
  });

  ws.on('close', () => {
    removeClient(roomId, userId);
    updateClients(roomId);
  });
});

const handleMove = (roomId, userId, position) => {
  rooms[roomId] = rooms[roomId].map(user => user.id === userId ? { ...user, position, hasMoved: true } : user);
  updateClients(roomId);
  manageWebRTCConnections(roomId, userId);
};

const manageWebRTCConnections = (roomId, userId) => {
  const movingUser = rooms[roomId].find(user => user.id === userId);
  if (!movingUser) return;

  let connectionsUpdated = false;

  rooms[roomId].forEach(user => {
    if (user.id !== userId) {
      const distance = calculateDistance(movingUser.position, user.position);
      const isConnected = movingUser.connectedUsers.includes(user.id);

      if (distance <= 0.2 && movingUser.hasMoved && user.hasMoved && !user.coolTime && !movingUser.coolTime) {
        if (!isConnected) {
          if (movingUser.connectedAt < user.connectedAt) {
            sendWebRTCSignal(movingUser.ws, user.id, 'offer');
            sendWebRTCSignal(user.ws, movingUser.id, 'answer');
          } else {
            sendWebRTCSignal(user.ws, movingUser.id, 'offer');
            sendWebRTCSignal(movingUser.ws, user.id, 'answer');
          }
          movingUser.connectedUsers.push(user.id);
          user.connectedUsers.push(movingUser.id);
          connectionsUpdated = true;
        }
      } else if (distance > 0.2 && isConnected) {
        disconnectWebRTC(user.ws, movingUser.id);
        disconnectWebRTC(movingUser.ws, user.id);
        movingUser.connectedUsers = movingUser.connectedUsers.filter(id => id !== user.id);
        user.connectedUsers = user.connectedUsers.filter(id => id !== movingUser.id);
      }
    }
  });

  if (!connectionsUpdated && movingUser.connectedUsers.length === 0) {
    setCoolTime(roomId, userId, true);
    setTimeout(() => {
      setCoolTime(roomId, userId, false);
    }, 10000);
  }
};

const sendWebRTCSignal = (ws, targetId, role) => {
  ws.send(JSON.stringify({ type: 'start_webrtc', targetId, role }));
};

const disconnectWebRTC = (ws, targetId) => {
  ws.send(JSON.stringify({ type: 'rtc_disconnect', targetId }));
};

const calculateDistance = (pos1, pos2) => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

const updateClients = (roomId) => {
  const allUsers = rooms[roomId].map(user => ({
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
  rooms[roomId].forEach(user => {
    user.connectedUsers = user.connectedUsers.filter(id => id !== userId);
  });
};

const setCoolTime = (roomId, userId, state) => {
  rooms[roomId] = rooms[roomId].map(user => user.id === userId ? { ...user, coolTime: state } : user);
  updateClients(roomId);
};

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
