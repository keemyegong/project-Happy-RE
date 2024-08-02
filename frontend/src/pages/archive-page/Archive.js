import React, { useState, useEffect } from 'react';
import './Archive.css';
// import MessageCard from '../../components/message-card/MessageCard';

const Archive = () => {
  const [messages, setMessages] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  useEffect(() => {
    const dummyMessages = [
      {
        id: 1,
        profileImageUrl: 'https://via.placeholder.com/150',
        userName: 'USER1',
        content: 'This is the first message content.',
      },
      {
        id: 2,
        profileImageUrl: 'https://via.placeholder.com/150',
        userName: 'USER2',
        content: 'This is the second message content.',
      },
      {
        id: 3,
        profileImageUrl: 'https://via.placeholder.com/150',
        userName: 'USER3',
        content: 'This is the third message content.',
      },
      {
        id: 4,
        profileImageUrl: 'https://via.placeholder.com/150',
        userName: 'USER4',
        content: 'This is the fourth message content.',
      },
      {
        id: 5,
        profileImageUrl: 'https://via.placeholder.com/150',
        userName: 'USER5',
        content: 'This is the fourth message content.',
      },
      {
        id: 6,
        profileImageUrl: 'https://via.placeholder.com/150',
        userName: 'USER6',
        content: 'This is the fourth message content.',
      },
    ];

    const dummyKeywords = [
      {
        id: 1,
        keyword: '워터파크',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
      {
        id: 2,
        keyword: '두꺼비',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
      {
        id: 3,
        keyword: '담배',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
      {
        id: 4,
        keyword: '워터파크',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
      {
        id: 5,
        keyword: '두꺼비',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
      {
        id: 6,
        keyword: '담배',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
      {
        id: 7,
        keyword: '워터파크',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
      {
        id: 8,
        keyword: '두꺼비',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
      {
        id: 9,
        keyword: '담배',
        date: '2024-08-02',
        summary: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.",
        emotionTags: ['#기쁨', '#신남', '#행복']
      },
    ];

    setMessages(dummyMessages);
    setKeywords(dummyKeywords);
  }, []);

  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
  };

  return (
    <div className="Archive">
      <div className="archive-container row">
        <div className="archive-mywords-container col-6">
          <div className="archive-mywords-header">
            <p className="archive-mywords-header-text">My Words</p>
          </div>
          <div className="archive-mywords-content">
            {keywords.map((keyword) => (
              <div
                className='archive-keyword'
                key={keyword.id}
                onClick={() => handleKeywordClick(keyword)}
                style={{
                  fontWeight: selectedKeyword?.id === keyword.id ? '800' : 'normal',
                  opacity: selectedKeyword?.id === keyword.id ? '1' : '0.7'
                }}
              >
                {keyword.keyword}
              </div>
            ))}
          </div>
          {selectedKeyword && (
            <div className='archive-myword-info-container'>
              <div className='archive-myword-info-header'>
                <p className='archive-myword-info-header-text'>{selectedKeyword.keyword}</p>
              </div>
              <div className='archive-myword-info-components'>
                <div className='archive-myword-info-report'>
                  <p>{selectedKeyword.date}</p>
                  <p>{selectedKeyword.summary}</p>
                  <div>
                    {selectedKeyword.emotionTags.map((tag, index) => (
                      <span key={index}>{tag} </span>
                    ))}
                  </div>
                </div>
                <div className='archive-myword-info-graph'>
                  {/* 키워드 그래프 영역 */}
                  graph 영역
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="archive-message-container col-6">
          <div className="archive-message-header">
            <p className="archive-message-header-text">Messages</p>
          </div>
          <div className="archive-message-content">
            {/* {messages.map((message) => (
              <MessageCard
                key={message.id}
                messageId={message.id}
                profileImageUrl={message.profileImageUrl}
                userName={message.userName}
                content={message.content}
              />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archive;
