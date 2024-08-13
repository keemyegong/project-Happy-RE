import { w3cwebsocket as W3CWebSocket } from "websocket";
import React, { useEffect, useState, useRef, useContext } from "react";
import defaultImg from "../../assets/characters/default.png";
import CoordinatesGraph from "../../components/ChatGraph/ChatGraph";
import CharacterList from "../../components/CharacterList/CharacterList";
import AudioEffect from "../../components/audio-api/AudioApi";
import artist from "../../assets/characters/art.png";
import butler from "../../assets/characters/butler.png";
import defaultPersona from "../../assets/characters/default.png";
import soldier from "../../assets/characters/soldier.png";
import steel from "../../assets/characters/steel.png";
import { universeVariable } from "../../App";
import Cookies from "js-cookie";
import axios from "axios";
import MessageQueue from "./MessageQueue";

import "./ChatRoomContainer.css";

const client = new W3CWebSocket("wss://i11b204.p.ssafy.io:5000/webrtc");

const RtcClient = ({ characterImage }) => {
  const [peerConnections, setPeerConnections] = useState({});
  const happyRelist = [defaultPersona, soldier, butler, steel, artist];
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef(position);
  const [users, setUsers] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [stream, setStream] = useState(null);
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const [userImage, setUserImage] = useState(characterImage || defaultImg);
  const [talkingUsers, setTalkingUsers] = useState([]);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const localAudioRef = useRef(null);
  const containerRef = useRef(null);
  const audioEffectRef = useRef(null);
  const [coolTime, setCoolTime] = useState(false);
  const universal = useContext(universeVariable);
  const messageQueue = useRef(null);
  const clientIdRef = useRef(clientId);
  const userImageRef = useRef(userImage);

  useEffect(() => {
    positionRef.current = position;
  }, [position, nearbyUsers]);

  useEffect(() => {
    clientIdRef.current = clientId;
  }, [clientId]);

  useEffect(() => {
    userImageRef.current = userImage;
  }, [userImage]);

  useEffect(() => {
    messageQueue.current = new MessageQueue(
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
      () => clientIdRef.current,
      () => positionRef.current,
      () => userImageRef.current
    );

    if (window.location.pathname !== "/webrtc") return;

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    client.onclose = () => {
      console.log("WebSocket Client Disconnected");
    };

    client.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      messageQueue.current.enqueue(dataFromServer);
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((currentStream) => {
          setStream(currentStream);
        })
        .catch((error) => {
          console.error("Error accessing media devices.", error);
        });
    } else {
      console.error("getUserMedia is not supported in this browser.");
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      client.close();

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [clientId, position, userImage, stream]);

  useEffect(() => {
    setUserImage(happyRelist[localStorage.getItem("personaNumber")]);
  }, []);

  useEffect(() => {
    axios
      .get(`${universal.defaultUrl}/api/useravg`, {
        headers: { Authorization: `Bearer ${Cookies.get("Authorization")}` },
      })
      .then((response) => {
        if (response.data.cnt == 0) {
          setPosition({
            x: response.data.russellSumX,
            y: response.data.russellSumY,
          });
        } else {
          setPosition({
            x: response.data.russellSumX / response.data.cnt,
            y: response.data.russellSumY / response.data.cnt,
          });
        }
      })
      .catch(() => {
        console.log("서버와 통신 불가");
      });
  }, []);

  const handleBeforeUnload = () => {
    client.send(JSON.stringify({ type: "disconnect" }));
    client.close();
    cleanupConnections();

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const cleanupConnections = () => {
    Object.values(peerConnections).forEach(({ peerConnection }) => {
      peerConnection.close();
    });
    setPeerConnections({});
    if (audioEffectRef.current) {
      Object.keys(peerConnections).forEach((userId) => {
        audioEffectRef.current.removeStream(userId);
      });
    }
  };

  const movePosition = (dx, dy) => {
    const newPosition = {
      x: Math.min(1, Math.max(-1, positionRef.current.x + dx)),
      y: Math.min(1, Math.max(-1, positionRef.current.y + dy)),
      id: clientId,
    };
    setPosition(newPosition);
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "move", position: newPosition }));
    }
  };
  
  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        movePosition(0, 0.005);
        break;
      case "ArrowDown":
        movePosition(0, -0.005);
        break;
      case "ArrowLeft":
        movePosition(-0.005, 0);
        break;
      case "ArrowRight":
        movePosition(0.005, 0);
        break;
      default:
        break;
    }
  };

  const createPeerConnection = (userId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  
    peerConnections[userId] = { peerConnection, pendingCandidates: [] };
  
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        client.send(
          JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
            sender: clientId,
            recipient: userId,
          })
        );
      }
    };
  
    peerConnection.ontrack = (event) => {
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = event.streams[0];
        if (audioEffectRef.current) {
          audioEffectRef.current.addStream(userId, event.streams[0]);
        }
      }
    };
  
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "connected") {
        console.log(`WebRTC connection established with user ${userId}`);
      } else {
        console.log(`WebRTC connection state with user ${userId}: ${peerConnection.connectionState}`);
      }
      if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "closed") {
        handleRtcDisconnect(userId);
      }
    };
  
    if (stream) {
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
    }
  
    return peerConnection;
  };

  const attemptOffer = (peerConnection, recipientId) => {
    if (!peerConnection) return;

    peerConnection
      .createOffer()
      .then((offer) => {
        peerConnection
          .setLocalDescription(offer)
          .then(() => {
            client.send(
              JSON.stringify({
                type: "offer",
                offer: offer.sdp,
                recipient: recipientId,
                sender: clientId,
              })
            );
            console.log(`Offer sent to ${recipientId}`);
          })
          .catch((error) =>
            console.error("Error setting local description:", error)
          );
      })
      .catch((error) => console.error("Error creating offer:", error));
  };

  const handleOffer = async (offer, sender) => {
    if (!sender) {
      console.error("No sender provided for offer");
      return;
    }

    let peerConnection = peerConnections[sender]?.peerConnection;

    if (!peerConnection || peerConnection.signalingState === "closed") {
      peerConnection = createPeerConnection(sender);
      setPeerConnections((prevConnections) => ({
        ...prevConnections,
        [sender]: { peerConnection },
      }));
    }

    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "offer", sdp: offer })
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      client.send(
        JSON.stringify({
          type: "answer",
          answer: answer.sdp,
          sender: clientId,
          recipient: sender,
        })
      );

      if (peerConnections[sender]?.pendingCandidates.length > 0) {
        for (const candidate of peerConnections[sender].pendingCandidates) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
        peerConnections[sender].pendingCandidates = [];
      }
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  };

  const handleAnswer = async (answer, sender) => {
    if (!sender) {
      console.error("No sender provided for answer");
      return;
    }

    const peerConnection = peerConnections[sender]?.peerConnection;

    if (!peerConnection) {
      console.error(`No peer connection found for sender ${sender}`);
      return;
    }

    try {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answer })
      );
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };

  const handleCandidate = async (candidate, sender) => {
    if (!sender) {
      console.error("No sender provided for candidate");
      return;
    }
  
    const connection = peerConnections[sender];
    if (!connection) {
      console.error(`No peer connection found for sender ${sender}`);
      return;
    }
    const peerConnection = connection.peerConnection;
  
    if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log(`ICE candidate added for ${sender}`);
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    } else {
      if (!peerConnections[sender].pendingCandidates) {
        peerConnections[sender].pendingCandidates = [];
      }
      peerConnections[sender].pendingCandidates.push(candidate);
      console.error(
        "Remote description not set yet. ICE candidate cannot be added. Adding to pending candidates."
      );
    }
  };

  const handleRtcDisconnect = (userId) => {
    if (peerConnections[userId]) {
      peerConnections[userId].peerConnection.close();
      const { [userId]: removedConnection, ...restConnections } =
        peerConnections;
      setPeerConnections(restConnections);
      setNearbyUsers((prev) => prev.filter((user) => user.id !== userId));
      if (audioEffectRef.current) {
        audioEffectRef.current.removeStream(userId);
      }
      
      if (Object.keys(restConnections).length === 0) {
        client.send(JSON.stringify({ type: "rtc_disconnect_all", userId: clientId }));
      }
    }
  };

  const handleScroll = (direction) => {
    if (direction === "up") {
      setDisplayStartIndex(Math.max(displayStartIndex - 1, 0));
    } else {
      setDisplayStartIndex(
        Math.min(displayStartIndex + 1, nearbyUsers.length - 4)
      );
    }
  };

  return (
    <div className="chat-room-container" ref={containerRef}>
      <div className="chat-graph-audio-container">
        <div className="chat-room-guide-container">
          <p className="chat-room-guide-title">마인드 톡</p>
          <p className="chat-room-guide-text">
            나와 비슷한 감정을 느끼는 사람들과 함께 마음속 이야기를 나눠보세요
            <br />
            키보드 방향키를 통해 나의 위치를 이동하고,
            <br />
            반경 안에 들어오는 친구와 소통할 수 있어요
            <br />
            서로의 이야기에 귀 기울이며 오늘의 감정을 공유해 볼까요?
          </p>
        </div>
        <div className="graph-chat-container">
          <div className="coordinates-graph-container">
            <CoordinatesGraph
              position={position}
              users={users}
              movePosition={movePosition}
              localAudioRef={localAudioRef}
              userImage={userImage}
              coolTime={coolTime}
            />
          </div>
          <div className="audio-effect-container">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12%"
                height="25%"
                fill="currentColor"
                className="audio-effect-icon bi bi-volume-up-fill"
                viewBox="0 0 16 16"
              >
                <path d="M11.536 14.01A8.47 8.47 0 0 0 14.026 8a8.47 8.47 0 0 0-2.49-6.01l-.708.707A7.48 7.48 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303z" />
                <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.48 5.48 0 0 1 11.025 8a5.48 5.48 0 0 1-1.61 3.89z" />
                <path d="M8.707 11.182A4.5 4.5 0 0 0 10.025 8a4.5 4.5 0 0 0-1.318-3.182L8 5.525A3.5 3.5 0 0 1 9.025 8 3.5 3.5 0 0 1 8 10.475zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06" />
              </svg>
            </span>
            <AudioEffect ref={audioEffectRef} />
          </div>
          <CharacterList
            nearbyUsers={nearbyUsers}
            displayStartIndex={displayStartIndex}
            handleScroll={handleScroll}
            talkingUsers={talkingUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default RtcClient;
