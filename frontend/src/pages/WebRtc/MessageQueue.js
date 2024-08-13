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
  