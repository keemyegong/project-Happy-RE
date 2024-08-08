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

const wss = new WebSocket.Server({ server, path: '/webrtc' });

const MAX_USERS_PER_ROOM = 6;
let rooms = {};  // 전역 변수로 rooms 정의

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

wss.on('connection', (ws) => {
  const userId = uuidv4();
  const userInfo = { id: userId, connectedAt: Date.now(), coolTime: false };

  const roomId = getRoomWithSpace();
  rooms[roomId].push({ ws, ...userInfo });

  ws.send(JSON.stringify({ type: 'assign_id', ...userInfo, roomId }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'connect':
        rooms[roomId] = rooms[roomId].map(user => user.id === userId ? { ...user, position: data.position, characterImage: data.characterImage, hasMoved: data.hasMoved, coolTime: data.coolTime } : user);
        const allUsers = rooms[roomId].map(user => ({
          id: user.id,
          position: user.position,
          characterImage: user.characterImage,
          hasMoved: user.hasMoved,
          connectedAt: user.connectedAt,
          coolTime: user.coolTime
        }));

        rooms[roomId].forEach(user => {
          user.ws.send(JSON.stringify({ type: 'all_users', users: allUsers.filter(u => u.id !== user.id) }));
        });
        break;

      case 'move':
        rooms[roomId] = rooms[roomId].map(user => user.id === userId ? { ...user, position: data.position, hasMoved: data.hasMoved, coolTime: data.coolTime } : user);

        rooms[roomId].forEach(user => {
          user.ws.send(JSON.stringify({ type: 'move', id: userId, position: data.position, hasMoved: data.hasMoved, coolTime: data.coolTime }));
        });
        break;

      case 'send_offer':
        const recipientUser = rooms[roomId].find(user => user.id === data.recipient);
        if (recipientUser) {
          recipientUser.ws.send(JSON.stringify({ type: 'receive_offer', sender: userId }));
        }
        break;

      case 'offer':
      case 'answer':
      case 'candidate':
        const recipient = rooms[roomId].find(user => user.id === data.recipient);
        if (recipient) {
          recipient.ws.send(JSON.stringify(data));
        } else {
          console.error(`User ${data.recipient} does not exist`);
        }
        break;

      case 'disconnect':
        rooms[roomId] = rooms[roomId].filter(user => user.id !== userId);

        rooms[roomId].forEach(user => {
          const otherClientsData = rooms[roomId].map(u => ({
            id: u.id,
            position: u.position,
            characterImage: u.characterImage,
            hasMoved: u.hasMoved,
            connectedAt: u.connectedAt,
            coolTime: u.coolTime
          }));

          user.ws.send(JSON.stringify({ type: 'update', clients: otherClientsData }));
        });
        break;

      case 'coolTime':
        rooms[roomId] = rooms[roomId].map(user => user.id === userId ? { ...user, coolTime: data.coolTime } : user);
        rooms[roomId].forEach(user => {
          user.ws.send(JSON.stringify({ type: 'coolTime', id: userId, coolTime: data.coolTime }));
        });
        break;

      default:
        console.error('Unrecognized message type:', data.type);
    }
  });

  ws.on('close', () => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(user => user.id !== userId);
  
      rooms[roomId].forEach(user => {
        const otherClientsData = rooms[roomId].map(u => ({
          id: u.id,
          position: u.position,
          characterImage: u.characterImage,
          hasMoved: u.hasMoved,
          coolTime: u.coolTime,
          connectedAt: u.connectedAt
        }));
  
        user.ws.send(JSON.stringify({ type: 'update', clients: otherClientsData }));
      });
    }
  });
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
