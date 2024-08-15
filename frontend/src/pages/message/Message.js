import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { universeVariable } from '../../App';
import axios from 'axios';
import './Message.css';
import Cookies from 'js-cookie';
import userProfileImage from '../../assets/sampleUserImage.jpg';
import Button from '../../components/Button/Button';
import MessageCard from '../../components/message-card/MessageCard';
import MessageInput from '../../components/message-input/MessageInput';

const Message = () => {
  const [image, setImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [showContainer, setShowContainer] = useState('messages'); // 'messages' or 'input'
  const universal = useContext(universeVariable);
  const [keywords, setKeywords] = useState([]);
  const [modal, setModal] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    getMessage();
    getKeywords();
    axios
      .get(`${universal.defaultUrl}/api/user/me`, {
        headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` },
      })
      .then((response) => {
        setNickname(response.data.name);
        setEmail(response.data.email);
      })
      .then(() => {
        axios
          .get(`${universal.defaultUrl}/api/user/profileimg`, {
            headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` },
            responseType: 'blob',
          })
          .then((response) => {
            const blobData = new Blob([response.data], { type: 'image/jpeg' });
            const url = window.URL.createObjectURL(blobData);
            setImage(url);
          })
          .catch(() => {
            setImage(userProfileImage);
          });
      });
  }, []);

  const toggleContainer = () => {
    setShowContainer(showContainer === 'messages' ? 'input' : 'messages');
  };

  const getMessage = () => {
    axios
      .get(`${universal.defaultUrl}/api/usermsg/4`, {
        headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` },
      })
      .then((response) => {
        console.log(response.data);
        setMessages(response.data);
      });
  };

  const getKeywords = () => {
    axios
      .get(`${universal.defaultUrl}/api/diary/detail/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        },
      })
      .then((response) => {
        if (response.data.keywordEntities != undefined) {
          setKeywords(response.data.keywordEntities);
        }
      });
  }; 

  return (
    <main className="Message">
      {modal && <div className="message-input-modal"></div>}
      <div className="message-profile-container">
        <div className="default-info">
          <div className="user-avatar">
            <img className="profile-page-user-image" src={image} alt="User profile" />
          </div>
          <div className="default-info-container">
            <p className="nickname">{nickname}</p>
            <p className="email">{email}</p>
            <Button
              className="btn dark-btn small"
              content="Edit Profile"
              onClick={() => {
                navigate('/user/update');
              }}
            />
          </div>
        </div>
      </div>
      <div className={`msg-container ${showContainer === 'messages' ? 'visible' : 'hidden'}`}>
        <div className="message-container">
          {messages.length === 0 ? (
            <div className="messages-none-text">
              아직 도착한 메시지가 없어요!
              <br />
              해피리 친구들의 바쁜 하루를 조금만 더 기다려 볼까요?
            </div>
          ) : (
            messages.map((message) => (
              <MessageCard
                key={message.userMessageId}
                messageId={message.userMessageId}
                persona={message.userEntity.myfrog}
                // profileImageUrl={message.userEntity.profileImageUrl}
                // userName={'익명의 해피리'}
                content={message.content}
                keyword={message.userMessageAttachedKeywordEntityList[0]}
              />
            ))
          )}
        </div>
      </div>
      <div className={`msg-container ${showContainer === 'input' ? 'visible' : 'hidden'}`}>
        <div className="input-container">
          <MessageInput keywords={keywords} />
        </div>
      </div>
      <Button
        className="toggle-btn btn dark-btn small"
        content={showContainer === 'messages' ? 'Show Input' : 'Show Messages'}
        onClick={toggleContainer}
      />
    </main>
  );
};

export default Message;
