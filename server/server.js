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

const kurentoUri = 'ws://localhost:8888/kurento';

kurento(kurentoUri, (error, client) => {
  if (error) {
    return console.error('Could not find media server at address ' + kurentoUri);
  }
  kurentoClient = client;
  console.log('Kurento Client Connected');
});

wss.on('connection', (ws) => {
  const userId = uuidv4();
  users[userId] = { ws, position: { x: 0, y: 0 }, characterImage: defaultImg };

  ws.send(JSON.stringify({ type: 'assign_id', id: userId }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    
    switch (data.type) {
      case 'connect':
        users[userId].position = data.position;
        users[userId].characterImage = data.characterImage;

        const allUsers = Object.keys(users).map(id => ({
          id,
          position: users[id].position,
          characterImage: users[id].characterImage
        }));

        Object.keys(users).forEach(id => {
          users[id].ws.send(JSON.stringify({ type: 'all_users', users: allUsers.filter(user => user.id !== id) }));
        });
        break;

      case 'move':
        users[userId].position = data.position;

        Object.keys(users).forEach(id => {
          users[id].ws.send(JSON.stringify({ type: 'move', id: userId, position: data.position }));
        });
        break;

      case 'offer':
        if (users[data.recipient]) {
          kurentoClient.create('MediaPipeline', (error, pipeline) => {
            if (error) return console.error(error);

            pipeline.create('WebRtcEndpoint', (error, senderEndpoint) => {
              if (error) return console.error(error);

              senderEndpoint.processOffer(data.offer, (error, sdpAnswer) => {
                if (error) return console.error(error);

                senderEndpoint.gatherCandidates((error) => {
                  if (error) return console.error(error);
                });

                users[userId].webRtcEndpoint = senderEndpoint;

                users[data.recipient].ws.send(JSON.stringify({ type: 'offer', offer: sdpAnswer, sender: userId }));
              });

              senderEndpoint.on('OnIceCandidate', (event) => {
                const candidate = kurento.getComplexType('IceCandidate')(event.candidate);
                users[data.recipient].ws.send(JSON.stringify({ type: 'candidate', candidate, sender: userId }));
              });
            });

            pipeline.create('WebRtcEndpoint', (error, recipientEndpoint) => {
              if (error) return console.error(error);

              recipientEndpoint.on('OnIceCandidate', (event) => {
                const candidate = kurento.getComplexType('IceCandidate')(event.candidate);
                users[userId].ws.send(JSON.stringify({ type: 'candidate', candidate, sender: data.recipient }));
              });

              users[data.recipient].webRtcEndpoint = recipientEndpoint;
            });
          });
        } else {
          console.error(`User ${data.recipient} does not exist`);
        }
        break;

      case 'answer':
        if (users[data.recipient]) {
          const sender = users[data.recipient].webRtcEndpoint;
          sender.processAnswer(data.answer, (error) => {
            if (error) return console.error('Error processing answer:', error);
          });
        } else {
          console.error(`User ${data.recipient} does not exist`);
        }
        break;

      case 'candidate':
        if (users[data.recipient]) {
          const candidate = kurento.getComplexType('IceCandidate')(data.candidate);
          users[data.recipient].webRtcEndpoint.addIceCandidate(candidate, (error) => {
            if (error) return console.error('Error adding candidate:', error);
          });
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
            characterImage: users[cId].characterImage
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
        characterImage: users[cId].characterImage
      })).filter(user => user.id !== id);

      users[id].ws.send(JSON.stringify({ type: 'update', clients: otherClientsData }));
    });
  });
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
