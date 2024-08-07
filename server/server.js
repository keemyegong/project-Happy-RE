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

let users = {};

wss.on('connection', (ws) => {
  const userId = uuidv4();
  const userInfo = { id: userId, connectedAt: Date.now() };
  ws.send(JSON.stringify({ type: 'assign_id', ...userInfo }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'connect':
        users[userId] = {
          ws,
          position: data.position,
          characterImage: data.characterImage,
          hasMoved: data.hasMoved,
          connectedAt: userInfo.connectedAt
        };

        const allUsers = Object.keys(users).map(id => ({
          id,
          position: users[id].position,
          characterImage: users[id].characterImage,
          hasMoved: users[id].hasMoved,
          connectedAt: users[id].connectedAt
        }));

        Object.keys(users).forEach(id => {
          users[id].ws.send(JSON.stringify({ type: 'all_users', users: allUsers.filter(user => user.id !== id) }));
        });
        break;

      case 'move':
        if (users[userId]) {
          users[userId].position = data.position;
          users[userId].hasMoved = data.hasMoved;

          Object.keys(users).forEach(id => {
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
        delete users[userId];

        Object.keys(users).forEach(id => {
          const otherClientsData = Object.keys(users).map(cId => ({
            id: cId,
            position: users[cId].position,
            characterImage: users[cId].characterImage,
            hasMoved: users[cId].hasMoved,
            connectedAt: users[cId].connectedAt
          })).filter(user => user.id !== id);

          users[id].ws.send(JSON.stringify({ type: 'update', clients: otherClientsData }));
        });
        break;

      default:
        console.error('Unrecognized message type:', data.type);
    }
  });

  ws.on('close', () => {
    delete users[userId];

    Object.keys(users).forEach(id => {
      const otherClientsData = Object.keys(users).map(cId => ({
        id: cId,
        position: users[cId].position,
        characterImage: users[cId].characterImage,
        hasMoved: users[cId].hasMoved,
        connectedAt: users[cId].connectedAt
      })).filter(user => user.id !== id);

      users[id].ws.send(JSON.stringify({ type: 'update', clients: otherClientsData }));
    });
  });
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
