const fs = require('fs');
const https = require('https');
const express = require('express');
const WebSocket = require('ws');
const kurento = require('kurento-client');
const { v4: uuidv4 } = require('uuid');

const app = express();

const server = https.createServer({
  cert: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/i11b204.p.ssafy.io/privkey.pem')
}, app);

const wss = new WebSocket.Server({ server, path: '/webrtc' });

const ws_uri = 'ws://i11b204.p.ssafy.io:8888/kurento';
let kurentoClient = null;

kurento(ws_uri, (error, client) => {
  if (error) return console.error('Kurento connection error:', error);
  kurentoClient = client;
  console.log('Kurento connected');
});

let clients = [];

wss.on('connection', function connection(ws, req) {
  if (req.url !== '/webrtc') {
    ws.close();
    return;
  }

  const clientId = uuidv4();
  ws.send(JSON.stringify({ type: 'clientId', id: clientId }));

  ws.on('message', async function incoming(message) {
    const data = JSON.parse(message);

    if (data.type === 'connect') {
      const client = {
        id: clientId,
        ws: ws,
        position: data.position,
        characterImage: data.characterImage,
        pipeline: null,
        webRtcEndpoint: null
      };

      clients.push(client);

      clients.forEach(client => {
        const otherClientsData = clients
          .filter(c => c.id !== client.id)
          .map(c => ({
            id: c.id,
            position: c.position,
            characterImage: c.characterImage
          }));

        client.ws.send(JSON.stringify({
          type: 'update',
          clients: otherClientsData
        }));
      });
    }

    if (data.type === 'offer') {
      const client = clients.find(c => c.id === clientId);

      if (!client.pipeline) {
        client.pipeline = await kurentoClient.create('MediaPipeline');
      }

      if (!client.webRtcEndpoint) {
        client.webRtcEndpoint = await client.pipeline.create('WebRtcEndpoint');
      }

      client.webRtcEndpoint.processOffer(data.sdpOffer, (error, sdpAnswer) => {
        if (error) return console.error('SDP process offer error:', error);

        client.ws.send(JSON.stringify({
          type: 'answer',
          sdpAnswer: sdpAnswer
        }));
      });

      client.webRtcEndpoint.gatherCandidates(error => {
        if (error) return console.error('Error gathering candidates:', error);
      });
    }

    if (data.type === 'candidate') {
      const client = clients.find(c => c.id === clientId);
      client.webRtcEndpoint.addIceCandidate(data.candidate);
    }
  });

  ws.on('close', () => {
    const client = clients.find(c => c.id === clientId);
    if (client.pipeline) {
      client.pipeline.release();
    }
    clients = clients.filter(c => c.id !== clientId);
  });
});

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});
