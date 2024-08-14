class MessageQueue {
    constructor(
      client,  // client 추가
      setClientId,
      setUsers,
      setCoolTime,
      setNearbyUsers,
      handleOffer,
      handleAnswer,
      handleCandidate,
      handleRtcDisconnect,
      setTalkingUsers,
      createPeerConnection,
      attemptOffer,
      setPeerConnections,
      getClientId,  // 함수로 변경
      getPosition,  // 함수로 변경
      getUserImage  // 함수로 변경
    ) {
      this.client = client;  // this.client에 client 설정
      this.queue = [];
      this.isProcessing = false;
      this.setClientId = setClientId;
      this.setUsers = setUsers;
      this.setCoolTime = setCoolTime;
      this.setNearbyUsers = setNearbyUsers;
      this.handleOffer = handleOffer;
      this.handleAnswer = handleAnswer;
      this.handleCandidate = handleCandidate;
      this.handleRtcDisconnect = handleRtcDisconnect;
      this.setTalkingUsers = setTalkingUsers;
      this.createPeerConnection = createPeerConnection;
      this.attemptOffer = attemptOffer;
      this.setPeerConnections = setPeerConnections;
      this.getClientId = getClientId;  // 함수로 변경
      this.getPosition = getPosition;  // 함수로 변경
      this.getUserImage = getUserImage;  // 함수로 변경
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
        const clientId = this.getClientId();
        const position = this.getPosition();
        const userImage = this.getUserImage();
  
        switch (message.type) {
          case 'assign_id':
            this.setClientId(message.id);
            this.client.send(JSON.stringify({  // this.client 사용
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
            this.setUsers(filteredUsers.filter(user => user.id !== clientId).map(user => ({
              ...user,
              image: user.characterImage,
            })));
            const currentUser = filteredUsers.find(user => user.id === clientId);
            if (currentUser) {
              this.setCoolTime(currentUser.coolTime);
              this.setNearbyUsers((currentUser.connectedUsers || []).map(connectedUser => ({
                id: connectedUser.id,
                image: connectedUser.characterImage,
              })));
            } else {
              this.setNearbyUsers([]);
            }
            break;
          case 'offer':
            this.handleOffer(message.offer, message.sender);
            break;
          case 'answer':
            this.handleAnswer(message.answer, message.sender);
            break;
          case 'candidate':
            this.handleCandidate(message.candidate, message.sender);
            break;
          case 'rtc_disconnect':
            this.handleRtcDisconnect(message.targetId);
            break;
          case 'talking':
            this.setTalkingUsers(message.talkingUsers);
            break;
          case 'start_webrtc':
            if (message.role === 'offer') {
              const peerConnection = this.createPeerConnection(message.targetId);
              this.attemptOffer(peerConnection, message.targetId);
            } else if (message.role === 'answer') {
              const peerConnection = this.createPeerConnection(message.targetId);
              this.setPeerConnections(prevConnections => ({
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
    }
  }
  
  export default MessageQueue;
  