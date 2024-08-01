const express = require('express');
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
// const kurento = require('kurento-client');
const path = require('path');

const app = express();
const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/privkey.pem')
}, app);

const wss = new WebSocket.Server({ server });
// const kurentoUri = 'ws://i11b204.p.ssafy.io:8888/kurento';
// let kurentoClient = null;

// kurento(kurentoUri, (error, client) => {
//   if (error) {
//     return console.error('Could not find Kurento media server at address ' + kurentoUri);
//   }
//   kurentoClient = client;
// });

let idCounter = 0;
const users = {};

wss.on('connection', (ws) => {
  const userId = idCounter++;
  users[userId] = { id: userId, ws: ws, position: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 } }; // pipeline과 webRtcEndpoint 제거
  ws.send(JSON.stringify({ type: 'assign_id', position: users[userId].position }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case 'move':
        handleMove(userId, data.position);
        break;
      case 'offer':
        // handleOffer(userId, data); // Kurento 관련 부분 주석 처리
        break;
      case 'candidate':
        // handleCandidate(userId, data.candidate); // Kurento 관련 부분 주석 처리
        break;
    }
  });

  ws.on('close', () => {
    // if (users[userId] && users[userId].pipeline) {
    //   users[userId].pipeline.release(); // Kurento 관련 부분 주석 처리
    // }
    delete users[userId];
  });
});

function handleMove(userId, position) {
  users[userId].position = position;
  broadcast({ users: Object.values(users).map(user => ({ id: user.id, position: user.position })) });

  const nearbyUsers = getNearbyUsers(userId, 0.2);
  if (nearbyUsers.length > 0) {
    // connectUsers(userId, nearbyUsers[0]); // Kurento 관련 부분 주석 처리
  }
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

// async function connectUsers(userId1, userId2) {
//   const user1 = users[userId1];
//   const user2 = users[userId2];

//   if (!kurentoClient) {
//     return user1.ws.send(JSON.stringify({ type: 'error', message: 'Kurento client is not initialized' }));
//   }

//   kurentoClient.create('MediaPipeline', (error, pipeline) => {
//     if (error) {
//       return user1.ws.send(JSON.stringify({ type: 'error', message: error }));
//     }
//     user1.pipeline = pipeline;
//     user2.pipeline = pipeline;

//     pipeline.create('WebRtcEndpoint', (error, webRtcEndpoint1) => {
//       if (error) {
//         return user1.ws.send(JSON.stringify({ type: 'error', message: error }));
//       }
//       user1.webRtcEndpoint = webRtcEndpoint1;

//       pipeline.create('WebRtcEndpoint', (error, webRtcEndpoint2) => {
//         if (error) {
//           return user2.ws.send(JSON.stringify({ type: 'error', message: error }));
//         }
//         user2.webRtcEndpoint = webRtcEndpoint2;

//         user1.webRtcEndpoint.connect(user2.webRtcEndpoint);
//         user2.webRtcEndpoint.connect(user1.webRtcEndpoint);

//         user1.webRtcEndpoint.gatherCandidates((error) => {
//           if (error) {
//             return user1.ws.send(JSON.stringify({ type: 'error', message: error }));
//           }
//         });
//         user2.webRtcEndpoint.gatherCandidates((error) => {
//           if (error) {
//             return user2.ws.send(JSON.stringify({ type: 'error', message: error }));
//           }
//         });
//       });
//     });
//   });
// }

// function handleOffer(userId, data) {
//   const user = users[userId];
//   if (!user.webRtcEndpoint) return;

//   user.webRtcEndpoint.processOffer(data.offer, (error, sdpAnswer) => {
//     if (error) {
//       return user.ws.send(JSON.stringify({ type: 'error', message: error }));
//     }
//     user.ws.send(JSON.stringify({ type: 'answer', answer: sdpAnswer }));
//   });
// }

// function handleCandidate(userId, candidate) {
//   const user = users[userId];
//   if (user.webRtcEndpoint) {
//     user.webRtcEndpoint.addIceCandidate(candidate);
//   }
// }

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
