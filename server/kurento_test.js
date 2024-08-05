const kurento = require('kurento-client');

const ws_uri = 'ws://i11b204.p.ssafy.io:8888/kurento';


kurento(ws_uri, (error, kurentoClient) => {
    if (error) return console.error('Kurento connection error:', error);
  
    kurentoClient.create('MediaPipeline', (error, pipeline) => {
      if (error) return console.error('MediaPipeline error:', error);
  
      pipeline.create('WebRtcEndpoint', (error, webRtcEndpoint) => {
        if (error) return console.error('WebRtcEndpoint error:', error);
  
        console.log('WebRtcEndpoint created successfully');
        
        // 추가적인 WebRTC 설정 및 테스트 코드를 여기에 작성합니다.
      });
    });
  });
