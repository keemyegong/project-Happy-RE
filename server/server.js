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
let kurentoClient = null;

kurento(ws_uri, (error, client) => {
  if (error) return console.error('Kurento connection error:', error);
  kurentoClient = client;
  console.log('Kurento connected');
});

let idCounter = 0;
const users = {};

wss.on('connection', (ws, req) => {
  const userId = idCounter++;
  users[userId] = { id: userId, ws: ws, position: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }, webRtcEndpoint: null };
  console.log(`User connected: ${userId}`);
  ws.send(JSON.stringify({ type: 'assign_id', position: users[userId].position, id: userId }));

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
        await handleOffer(userId, data.offer);
        break;
      case 'candidate':
        await handleCandidate(userId, data.candidate);
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
    console.log(`User ${userId} is near users:`, nearbyUsers.map(u => u.id));
  }
}

async function handleOffer(userId, offer) {
  const user = users[userId];
  if (!user) return;

  if (!user.webRtcEndpoint) {
    user.webRtcEndpoint = await createWebRtcEndpoint(userId);
  }

  user.webRtcEndpoint.processOffer(offer, (error, answer) => {
    if (error) {
      return console.error('Error processing offer:', error);
    }
    user.ws.send(JSON.stringify({ type: 'answer', answer }));
  });
}

async function handleCandidate(userId, candidate) {
  const user = users[userId];
  if (!user || !user.webRtcEndpoint) return;

  user.webRtcEndpoint.addIceCandidate(candidate, (error) => {
    if (error) {
      return console.error('Error adding ICE candidate:', error);
    }
  });
}

function handleDisconnect(userId) {
  const user = users[userId];
  if (user && user.webRtcEndpoint) {
    user.webRtcEndpoint.release();
  }
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

function createWebRtcEndpoint(userId) {
  return new Promise((resolve, reject) => {
    kurentoClient.create('MediaPipeline', (error, pipeline) => {
      if (error) return reject(error);

      pipeline.create('WebRtcEndpoint', (error, webRtcEndpoint) => {
        if (error) return reject(error);

        webRtcEndpoint.on('OnIceCandidate', (event) => {
          const candidate = kurento.getComplexType('IceCandidate')(event.candidate);
          const user = users[userId];
          if (user) {
            user.ws.send(JSON.stringify({
              type: 'candidate',
              candidate
            }));
          }
        });

        webRtcEndpoint.gatherCandidates((error) => {
          if (error) return reject(error);
        });

        resolve(webRtcEndpoint);
      });
    });
  });
}

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
