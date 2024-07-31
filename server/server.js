const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// const kurento = require('kurento-client');
// const kurentoUri = 'ws://i11b204.p.ssafy.io:8888/kurento'; // Kurento Media Server 주소
// let kurentoClient = null;
let users = [];
let idCounter = 0;

// kurento(kurentoUri, (error, client) => {
//   if (error) {
//     return console.error('Could not find Kurento media server at address ' + kurentoUri);
//   }
//   kurentoClient = client;
// });

wss.on('connection', (socket) => {
  console.log('WebSocket Client Connected');
  const userId = idCounter++;
  let userPosition = { id: userId, x: (Math.random() * 2) - 1, y: (Math.random() * 2) - 1 };
  users.push(userPosition);

  socket.send(JSON.stringify({ type: 'assign_id', position: userPosition }));
  broadcast({ users });

  socket.on('message', async (message) => {
    const data = JSON.parse(message);
    if (data.type === 'move') {
      const user = users.find(user => user.id === data.position.id);
      if (user) {
        user.x = data.position.x;
        user.y = data.position.y;
      }
      broadcast({ users });
    }
    // else if (data.type === 'offer') {
    //   const sender = data.sender;
    //   const recipient = data.recipient;
    //   const offer = data.offer;

    //   const senderUser = users.find(user => user.id === sender);
    //   const recipientUser = users.find(user => user.id === recipient);

    //   if (senderUser && recipientUser) {
    //     const pipeline = await createPipeline();
    //     const senderWebRtc = await createWebRtcEndpoint(pipeline);
    //     const recipientWebRtc = await createWebRtcEndpoint(pipeline);

    //     await senderWebRtc.processOffer(offer);
    //     const answer = await senderWebRtc.generateAnswer();
    //     socket.send(JSON.stringify({ type: 'answer', answer, recipient: sender }));

    //     connectWebRtcEndpoints(senderWebRtc, recipientWebRtc);

    //     socket.on('close', () => {
    //       pipeline.release();
    //     });
    //   }
    // } else if (data.type === 'candidate') {
    //   const userId = data.sender;
    //   const candidate = kurento.getComplexType('IceCandidate')(data.candidate);
    //   const user = users.find(user => user.id === userId);
    //   if (user && user.webRtcEndpoint) {
    //     user.webRtcEndpoint.addIceCandidate(candidate);
    //   }
    // }
  });

  socket.on('close', () => {
    users = users.filter(user => user.id !== userId);
    broadcast({ users });
  });
});

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// async function createPipeline() {
//   return new Promise((resolve, reject) => {
//     kurentoClient.create('MediaPipeline', (error, pipeline) => {
//       if (error) {
//         return reject(error);
//       }
//       resolve(pipeline);
//     });
//   });
// }

// async function createWebRtcEndpoint(pipeline) {
//   return new Promise((resolve, reject) => {
//     pipeline.create('WebRtcEndpoint', (error, webRtcEndpoint) => {
//       if (error) {
//         return reject(error);
//       }
//       resolve(webRtcEndpoint);
//     });
//   });
// }

// async function connectWebRtcEndpoints(senderWebRtc, recipientWebRtc) {
//   return new Promise((resolve, reject) => {
//     senderWebRtc.connect(recipientWebRtc, (error) => {
//       if (error) {
//         return reject(error);
//       }
//       resolve();
//     });
//   });
// }

// React 애플리케이션 빌드 파일을 제공
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
