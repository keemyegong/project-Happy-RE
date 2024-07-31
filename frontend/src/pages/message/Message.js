import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { universeVariable } from '../../App';
import axios from 'axios';
import './Message.css';
import Cookies from 'js-cookie';
import userProfileImage from '../../assets/sampleUserImage.jpg';
import Button from '../../components/Button/Button';
import MessageCard from '../../components/message-card/MessageCard';

const Message = () => {
  const [image, setImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const universal = useContext(universeVariable);
  let navigate = useNavigate();

  useEffect(() => {
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

    // Fetch messages
    // axios
    //   .get(`${universal.defaultUrl}/api/messages`, {
    //     headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` },
    //   })
    //   .then((response) => {
    //     setMessages(response.data.messages);
    //   });

    // Dummy data for messages
    const dummyMessages = [
      {
        id: 1,
        profileImageUrl: userProfileImage,
        userName: 'John Doe',
        content: 'This is the first message content.',
      },
      {
        id: 2,
        profileImageUrl: userProfileImage,
        userName: 'Jane Smith',
        content: 'This is the second message content.',
      },
      {
        id: 3,
        profileImageUrl: userProfileImage,
        userName: 'Alice Johnson',
        content: 'This is the third message content.',
      },
      {
        id: 4,
        profileImageUrl: userProfileImage,
        userName: 'Bob Brown',
        content: 'This is the fourth message content.',
      },
    ];

    setMessages(dummyMessages);
  }, []);

  return (
    <main className="Message">
      <div className="profile-container">
        <div className="default-info">
          <div className="user-avatar">
            <img className="profile-image" src={image} alt="User profile" />
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
      <div className="message-container">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            messageId={message.id}
            profileImageUrl={message.profileImageUrl}
            userName={message.userName}
            content={message.content}
          />
        ))}
      </div>
      <div className="input-container">
        
      </div>
    </main>
  );
};

export default Message;
