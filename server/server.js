const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const kurento = require('kurento-client');

const app = express();
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/privkey.pem')
}, app);

const wss = new WebSocket.Server({ server, path: '/webrtc' });

let users = {};
let kurentoClient = null;
const kurentoUri = 'ws://i11b204.p.ssafy.io:8888/kurento';

const initializeKurentoClient = async () => {
  while (!kurentoClient) {
    try {
      kurentoClient = await new Promise((resolve, reject) => {
        kurento(kurentoUri, (error, client) => {
          if (error) {
            reject(error);
          } else {
            resolve(client);
          }
        });
      });
      console.log('Kurento Client Connected');
    } catch (error) {
      console.error('Could not find media server at address ' + kurentoUri + '. Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

initializeKurentoClient();

wss.on('connection', (ws) => {
  const userId = uuidv4();
  ws.send(JSON.stringify({ type: 'assign_id', id: userId }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'connect':
        users[userId] = {
          ws,
          position: data.position,
          characterImage: data.characterImage,
          hasMoved: data.hasMoved,
          id: userId // added id for comparison
        };

        const allUsers = Object.keys(users).map(id => ({
          id,
          position: users[id].position,
          characterImage: users[id].characterImage,
          hasMoved: users[id].hasMoved // send hasMoved state
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
        const offerRecipient = users[data.recipient];
        if (offerRecipient) {
          offerRecipient.ws.send(JSON.stringify({ type: 'offer', offer: data.offer, sender: userId }));
        } else {
          console.error(`User ${data.recipient} does not exist or WebRtcEndpoint is not initialized`);
        }
        break;

      case 'answer':
        const answerRecipient = users[data.recipient];
        if (answerRecipient) {
          answerRecipient.ws.send(JSON.stringify({ type: 'answer', answer: data.answer, sender: userId }));
        } else {
          console.error(`User ${data.recipient} does not exist or WebRtcEndpoint is not initialized`);
        }
        break;

      case 'candidate':
        const candidateRecipient = users[data.recipient];
        if (candidateRecipient) {
          candidateRecipient.ws.send(JSON.stringify({ type: 'candidate', candidate: data.candidate, sender: userId }));
        } else {
          console.error(`User ${data.recipient} does not exist or WebRtcEndpoint is not initialized`);
        }
        break;

      case 'disconnect':
        delete users[userId];

        Object.keys(users).forEach(id => {
          const otherClientsData = Object.keys(users).map(cId => ({
            id: cId,
            position: users[cId].position,
            characterImage: users[cId].characterImage,
            hasMoved: users[cId].hasMoved // send hasMoved state
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
        hasMoved: users[cId].hasMoved // send hasMoved state
      })).filter(user => user.id !== id);

      users[id].ws.send(JSON.stringify({ type: 'update', clients: otherClientsData }));
    });
  });
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
