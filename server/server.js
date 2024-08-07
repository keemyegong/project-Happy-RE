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
let rooms = {}; // 방을 관리하기 위한 객체

wss.on('connection', (ws) => {
  const userId = uuidv4();
  let roomId = Object.keys(rooms).find(roomId => rooms[roomId].length < MAX_USERS_PER_ROOM);

  if (!roomId) {
    roomId = uuidv4();
    rooms[roomId] = [];
  }

  rooms[roomId].push(userId);
  ws.send(JSON.stringify({ type: 'assign_id', id: userId, roomId }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'connect':
        users[userId] = {
          ws,
          roomId,
          position: data.position,
          characterImage: data.characterImage,
          hasMoved: data.hasMoved,
          connectedAt: Date.now()
        };

        const roomUsers = rooms[roomId].map(id => ({
          id,
          position: users[id].position,
          characterImage: users[id].characterImage,
          hasMoved: users[id].hasMoved,
          connectedAt: users[id].connectedAt
        }));

        roomUsers.forEach(user => {
          users[user.id].ws.send(JSON.stringify({ type: 'all_users', users: roomUsers.filter(u => u.id !== user.id) }));
        });
        break;

      case 'move':
        if (users[userId]) {
          users[userId].position = data.position;
          users[userId].hasMoved = data.hasMoved;

          rooms[roomId].forEach(id => {
            users[id].ws.send(JSON.stringify({ type: 'move', id: userId, position: data.position, hasMoved: data.hasMoved }));
          });
        }
        break;

      case 'send_offer':
        const recipientUser = users[data.recipient];
        if (recipientUser) {
          recipientUser.ws.send(JSON.stringify({ type: 'receive_offer', sender: userId }));
        }
        break;

      case 'offer':
      case 'answer':
      case 'candidate':
        if (users[data.recipient]) {
          users[data.recipient].ws.send(JSON.stringify(data));
        } else {
          console.error(`User ${data.recipient} does not exist`);
        }
        break;

      case 'disconnect':
        if (users[userId]) {
          rooms[roomId] = rooms[roomId].filter(id => id !== userId);
          delete users[userId];

          rooms[roomId].forEach(id => {
            users[id].ws.send(JSON.stringify({ type: 'update', clients: rooms[roomId].map(cId => ({
              id: cId,
              position: users[cId].position,
              characterImage: users[cId].characterImage,
              hasMoved: users[cId].hasMoved,
              connectedAt: users[cId].connectedAt
            })) }));
          });

          if (rooms[roomId].length === 0) {
            delete rooms[roomId];
          }
        }
        break;

      default:
        console.error('Unrecognized message type:', data.type);
    }
  });

  ws.on('close', () => {
    if (users[userId]) {
      rooms[roomId] = rooms[roomId].filter(id => id !== userId);
      delete users[userId];

      rooms[roomId].forEach(id => {
        users[id].ws.send(JSON.stringify({ type: 'update', clients: rooms[roomId].map(cId => ({
          id: cId,
          position: users[cId].position,
          characterImage: users[cId].characterImage,
          hasMoved: users[cId].hasMoved,
          connectedAt: users[cId].connectedAt
        })) }));
      });

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
