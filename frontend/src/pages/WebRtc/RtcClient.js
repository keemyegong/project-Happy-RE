import React, { useEffect, useState, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useLocation } from 'react-router-dom';
import kurentoUtils from 'kurento-utils';

const RtcClient = ({ initialPosition, characterImage }) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(null);
  const ws = useRef(null);
  const webRtcPeer = useRef(null);
  const remoteAudio = useRef(null); // Remote audio element
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/webrtc') {
      if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
        ws.current = new W3CWebSocket('wss://i11b204.p.ssafy.io:5000/webrtc');

        ws.current.onopen = () => {
          console.log('WebSocket connection opened');
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === 'clientId') {
            setClientId(data.id);
            ws.current.send(JSON.stringify({
              type: 'connect',
              position: initialPosition,
              characterImage
            }));
          }

          if (data.type === 'update') {
            setClients(data.clients);
          }

          if (data.type === 'answer') {
            console.log('SDP Answer received:', data.sdpAnswer);
            webRtcPeer.current.processAnswer(data.sdpAnswer, (error) => {
              if (error) {
                console.error('Error processing SDP answer:', error);
              } else {
                console.log('SDP Answer processed successfully');
              }
            });
          }

          if (data.type === 'candidate') {
            console.log('ICE Candidate received:', data.candidate);
            webRtcPeer.current.addIceCandidate(data.candidate, (error) => {
              if (error) {
                console.error('Error adding ICE candidate:', error);
              } else {
                console.log('ICE Candidate added successfully');
              }
            });
          }
        };

        ws.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
      }
    } else {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    }
  }, [location.pathname, initialPosition, characterImage]);

  useEffect(() => {
    if (clientId) {
      const options = {
        mediaConstraints: { audio: true, video: false },
        onicecandidate: (candidate) => {
          console.log('ICE Candidate generated:', candidate);
          ws.current.send(JSON.stringify({
            type: 'candidate',
            candidate: candidate
          }));
        },
        onaddstream: (event) => {
          console.log('Remote stream added:', event.stream);
          if (remoteAudio.current) {
            remoteAudio.current.srcObject = event.stream;

            // 원격 스트림의 트랙을 출력합니다.
            const audioTracks = event.stream.getAudioTracks();
            console.log('Remote stream audio tracks:', audioTracks);
          }
        }
      };

      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
          console.log('Local stream:', stream);

          // 로컬 스트림의 트랙을 출력합니다.
          const audioTracks = stream.getAudioTracks();
          console.log('Local stream audio tracks:', audioTracks);

          options.localStream = stream;

          webRtcPeer.current = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, (error) => {
            if (error) {
              console.error('Error creating WebRtcPeer:', error);
              return;
            }

            console.log('WebRtcPeer created successfully');

            webRtcPeer.current.generateOffer((error, sdpOffer) => {
              if (error) {
                console.error('Error generating SDP offer:', error);
                return;
              }

              console.log('SDP Offer generated:', sdpOffer);
              ws.current.send(JSON.stringify({
                type: 'offer',
                sdpOffer: sdpOffer
              }));
            });
          });
        })
        .catch(error => {
          console.error('Error accessing media devices:', error);
        });
    }

    // 컴포넌트 언마운트 시 WebRTC 피어 연결을 끊는 부분 제거
    // return () => {
    //   if (webRtcPeer.current) {
    //     webRtcPeer.current.dispose();
    //   }
    // };
  }, [clientId]);

  return (
    <div>
      <h1>현재 접속 중인 클라이언트</h1>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            ID: {client.id}, 위치: ({client.position.x}, {client.position.y}), 캐릭터 이미지: {client.characterImage}
          </li>
        ))}
      </ul>
      <audio ref={remoteAudio} autoPlay controls /> {/* Remote audio element */}
    </div>
  );
};

export default RtcClient;
