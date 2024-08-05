const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 5001, path: '/webrtc' });

let clients = [];

wss.on('connection', function connection(ws, req) {
  if (req.url !== '/webrtc') {
    ws.close();
    return;
  }

  const clientId = uuidv4(); // UUID를 사용하여 고유한 클라이언트 ID 생성
  ws.send(JSON.stringify({ type: 'clientId', id: clientId }));

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if (data.type === 'connect') {
      const client = {
        id: clientId,
        ws: ws,
        position: data.position,
        characterImage: data.characterImage
      };

      clients.push(client);

      // 모든 클라이언트에게 현재 연결된 다른 유저 정보 전송
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
  });

  ws.on('close', function close() {
    clients = clients.filter(client => client.ws !== ws);

    // 연결이 끊어진 후 업데이트된 클라이언트 정보 전송
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
  });
});

console.log('WebSocket server is running on ws://localhost:5001/webrtc');
