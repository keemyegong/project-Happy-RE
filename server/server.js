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

const calculateDistance = (pos1, pos2) => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

const checkAndConnectUsers = () => {
  if (!kurentoClient) {
    console.error('Kurento client is not initialized');
    return;
  }

  const userIds = Object.keys(users);
  userIds.forEach(userId => {
    userIds.forEach(otherUserId => {
      if (userId !== otherUserId && calculateDistance(users[userId].position, users[otherUserId].position) <= 0.2) {
        connectUsers(userId, otherUserId);
      } else if (userId !== otherUserId && calculateDistance(users[userId].position, users[otherUserId].position) > 0.2) {
        disconnectUsers(userId, otherUserId);
      }
    });
  });
};

const connectUsers = (userId, otherUserId) => {
  const user = users[userId];
  const otherUser = users[otherUserId];

  if (user && otherUser && !user.webRtcEndpoint && !otherUser.webRtcEndpoint) {
    kurentoClient.create('MediaPipeline', (error, pipeline) => {
      if (error) return console.error('Error creating MediaPipeline: ', error);
      console.log(`MediaPipeline created for users ${userId} and ${otherUserId}`);

      pipeline.create('WebRtcEndpoint', (error, senderEndpoint) => {
        if (error) return console.error('Error creating WebRtcEndpoint for sender: ', error);
        console.log(`WebRtcEndpoint created for sender: ${userId}`);

        pipeline.create('WebRtcEndpoint', (error, receiverEndpoint) => {
          if (error) return console.error('Error creating WebRtcEndpoint for receiver: ', error);
          console.log(`WebRtcEndpoint created for receiver: ${otherUserId}`);

          user.webRtcEndpoint = senderEndpoint;
          otherUser.webRtcEndpoint = receiverEndpoint;

          senderEndpoint.on('IceCandidateFound', (event) => {
            const candidate = kurento.getComplexType('IceCandidate')(event.candidate);
            otherUser.ws.send(JSON.stringify({ type: 'candidate', candidate, sender: userId }));
          });

          receiverEndpoint.on('IceCandidateFound', (event) => {
            const candidate = kurento.getComplexType('IceCandidate')(event.candidate);
            user.ws.send(JSON.stringify({ type: 'candidate', candidate, sender: otherUserId }));
          });

          senderEndpoint.generateOffer((error, offer) => {
            if (error) return console.error('Error generating offer from sender: ', error);
            user.ws.send(JSON.stringify({ type: 'offer', sdp: offer, sender: userId }));
          });

          receiverEndpoint.generateOffer((error, offer) => {
            if (error) return console.error('Error generating offer from receiver: ', error);
            otherUser.ws.send(JSON.stringify({ type: 'offer', sdp: offer, sender: otherUserId }));
          });
        });
      });
    });
  }
};

const disconnectUsers = (userId, otherUserId) => {
  const user = users[userId];
  const otherUser = users[otherUserId];

  if (user && otherUser && user.webRtcEndpoint && otherUser.webRtcEndpoint) {
    user.webRtcEndpoint.release();
    otherUser.webRtcEndpoint.release();

    delete user.webRtcEndpoint;
    delete otherUser.webRtcEndpoint;

    user.ws.send(JSON.stringify({ type: 'rtc_disconnect', id: otherUserId }));
    otherUser.ws.send(JSON.stringify({ type: 'rtc_disconnect', id: userId }));
    
    console.log(`WebRTC connection closed between users ${userId} and ${otherUserId}`);
  }
};

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
          characterImage: data.characterImage
        };

        const allUsers = Object.keys(users).map(id => ({
          id,
          position: users[id].position,
          characterImage: users[id].characterImage
        }));

        Object.keys(users).forEach(id => {
          users[id].ws.send(JSON.stringify({ type: 'all_users', users: allUsers.filter(user => user.id !== id) }));
        });

        checkAndConnectUsers();
        break;

      case 'move':
        if (users[userId]) {
          users[userId].position = data.position;

          Object.keys(users).forEach(id => {
            users[id].ws.send(JSON.stringify({ type: 'move', id: userId, position: data.position }));
          });

          checkAndConnectUsers();
        }
        break;

      case 'offer':
        if (users[data.recipient] && users[data.recipient].webRtcEndpoint) {
          users[data.recipient].webRtcEndpoint.processOffer(data.offer, (error, sdpAnswer) => {
            if (error) return console.error('Error processing offer: ', error);

            users[data.recipient].ws.send(JSON.stringify({ type: 'answer', answer: sdpAnswer, sender: userId }));
          });
        } else {
          console.error(`User ${data.recipient} does not exist or WebRtcEndpoint is not initialized`);
        }
        break;

      case 'answer':
        if (users[data.recipient] && users[data.recipient].webRtcEndpoint) {
          users[data.recipient].webRtcEndpoint.processAnswer(data.answer, (error) => {
            if (error) return console.error('Error processing answer:', error);
          });
        } else {
          console.error(`User ${data.recipient} does not exist or WebRtcEndpoint is not initialized`);
        }
        break;

      case 'candidate':
        if (users[data.recipient] && users[data.recipient].webRtcEndpoint) {
          const candidate = kurento.getComplexType('IceCandidate')(data.candidate);
          users[data.recipient].webRtcEndpoint.addIceCandidate(candidate, (error) => {
            if (error) return console.error('Error adding candidate:', error);
          });
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
