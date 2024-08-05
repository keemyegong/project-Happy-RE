const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const kurento = require('kurento-client');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/privkey.pem')
}, app);

const ws_uri = 'ws://i11b204.p.ssafy.io:8888/kurento';
let kurentoClient = null;

kurento(ws_uri, (error, client) => {
  if (error) return console.error('Kurento connection error:', error);
  kurentoClient = client;
  console.log('Kurento connected');
});

const wss = new WebSocket.Server({ noServer: true });

const users = {};

wss.on('connection', (ws, req) => {
  const userId = uuidv4();
  ws.send(JSON.stringify({ type: 'assign_id', id: userId }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    console.log(`Received message from user ${userId}:`, data);
    switch (data.type) {
      case 'connect':
        handleConnect(userId, ws, data.position, data.characterImage);
        break;
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

function handleConnect(userId, ws, position, characterImage) {
  users[userId] = { id: userId, ws, position, characterImage, webRtcEndpoint: null };

  const otherUsers = Object.values(users).filter(user => user.id !== userId);
  ws.send(JSON.stringify({ type: 'all_users', users: otherUsers.map(user => ({ id: user.id, position: user.position, characterImage: user.characterImage })) }));

  broadcastToOthers(userId, {
    type: 'new_user',
    id: userId,
    position,
    characterImage
  });
}

function handleMove(userId, position) {
  users[userId].position = position;
  broadcastToOthers(userId, { type: 'move', id: userId, position });

  // Check distances and close WebRTC connections if necessary
  Object.keys(users).forEach(otherUserId => {
    if (otherUserId !== userId) {
      const distance = calculateDistance(users[userId].position, users[otherUserId].position);
      if (distance > 0.2 && users[userId].webRtcEndpoint && users[otherUserId].webRtcEndpoint) {
        users[userId].webRtcEndpoint.release();
        users[otherUserId].webRtcEndpoint.release();
        users[userId].webRtcEndpoint = null;
        users[otherUserId].webRtcEndpoint = null;
        users[userId].ws.send(JSON.stringify({ type: 'rtc_disconnect', id: otherUserId }));
        users[otherUserId].ws.send(JSON.stringify({ type: 'rtc_disconnect', id: userId }));
      }
    }
  });
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

function broadcastToOthers(excludeUserId, message) {
  wss.clients.forEach(client => {
    const user = Object.values(users).find(user => user.ws === client);
    if (client.readyState === WebSocket.OPEN && user && user.id !== excludeUserId) {
      client.send(JSON.stringify(message));
    }
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

        webRtcEndpoint.on('IceCandidateFound', (event) => {
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

function calculateDistance(position1, position2) {
  const dx = position1.x - position2.x;
  const dy = position1.y - position2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `https://${request.headers.host}`).pathname;

  if (pathname === '/webrtc') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
