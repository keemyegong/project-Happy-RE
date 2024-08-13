class MessageQueue {
    constructor() {
      this.queue = [];
      this.isProcessing = false;
    }
  
    enqueue(message) {
      this.queue.push(message);
      this.processQueue();
    }
  
    async processQueue() {
      if (this.isProcessing) return;
      this.isProcessing = true;
  
      while (this.queue.length > 0) {
        const message = this.queue.shift();
        await this.handleMessage(message);
      }
  
      this.isProcessing = false;
    }
  
    handleMessage(message) {
      return new Promise((resolve) => {
        // 메시지 처리 로직
        console.log('Processing message:', message);
        // 메시지 처리 완료 후 resolve 호출
        resolve();
      });
    }
  }
  
  export default MessageQueue;
  
  MessageQueue.prototype.handleMessage = function(message) {
    return new Promise((resolve) => {
      switch (message.type) {
        case 'assign_id':
          setClientId(message.id);
          client.send(JSON.stringify({
            type: 'connect',
            position,
            characterImage: userImage,
          }));
          break;
        case 'update':
          const filteredUsers = message.clients.map(user => ({
            ...user,
            position: user.position || { x: 0, y: 0 },
            connectedAt: user.connectedAt || 0,
          }));
          setUsers(filteredUsers.filter(user => user.id !== clientId).map(user => ({
            ...user,
            image: user.characterImage,
          })));
          const currentUser = filteredUsers.find(user => user.id === clientId);
          if (currentUser) {
            setCoolTime(currentUser.coolTime);
            setNearbyUsers((currentUser.connectedUsers || []).map(connectedUser => ({
              id: connectedUser.id,
              image: connectedUser.characterImage,
            })));
          } else {
            setNearbyUsers([]);
          }
          break;
        case 'offer':
          handleOffer(message.offer, message.sender);
          break;
        case 'answer':
          handleAnswer(message.answer, message.sender);
          break;
        case 'candidate':
          handleCandidate(message.candidate, message.sender);
          break;
        case 'rtc_disconnect':
          handleRtcDisconnect(message.targetId);
          break;
        case 'talking':
          setTalkingUsers(message.talkingUsers);
          break;
        case 'start_webrtc':
          if (message.role === 'offer') {
            const peerConnection = createPeerConnection(message.targetId);
            attemptOffer(peerConnection, message.targetId);
          } else if (message.role === 'answer') {
            const peerConnection = createPeerConnection(message.targetId);
            setPeerConnections(prevConnections => ({
              ...prevConnections,
              [message.targetId]: { peerConnection },
            }));
          }
          break;
        default:
          console.error('Unrecognized message type:', message.type);
      }
      resolve();
    });
  };