import React, { useState, useEffect } from 'react';
import './Archive.css';
import KeywordCard from '../../components/diary-report/KeywordCard';
import Test from '../../components/emotion-graph/Test';

const Archive = () => {
  const [messages, setMessages] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [emotionData, setEmotionData] = useState([]); 
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [filteredKeywords, setFilteredKeywords] = useState([]);

  useEffect(() => {
    const dummyMessages = [
      { id: 1, profileImageUrl: 'https://via.placeholder.com/150', userName: 'USER1', content: 'This is the first message content.' },
      { id: 2, profileImageUrl: 'https://via.placeholder.com/150', userName: 'USER2', content: 'This is the second message content.' },
      { id: 3, profileImageUrl: 'https://via.placeholder.com/150', userName: 'USER3', content: 'This is the third message content.' },
      { id: 4, profileImageUrl: 'https://via.placeholder.com/150', userName: 'USER4', content: 'This is the fourth message content.' },
      { id: 5, profileImageUrl: 'https://via.placeholder.com/150', userName: 'USER5', content: 'This is the fourth message content.' },
      { id: 6, profileImageUrl: 'https://via.placeholder.com/150', userName: 'USER6', content: 'This is the fourth message content.' },
    ];

    const dummyKeywords = [
      { id: 1, title: '워터파크', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 2, title: '두꺼비', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 3, title: '담배', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 4, title: '워터파크', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 5, title: '두꺼비', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 6, title: '담배', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 7, title: '워터파크', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 8, title: '두꺼비', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 9, title: '담배', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
    ];

    setMessages(dummyMessages);
    setKeywords(dummyKeywords);
    
    if (dummyKeywords.length > 0) {
      setSelectedKeyword(dummyKeywords[0]);
      setFilteredKeywords(dummyKeywords.filter(kw => kw.title === dummyKeywords[0].title));
    }
  }, []);

  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
    setFilteredKeywords(keywords.filter(kw => kw.title === keyword.title));
    setCurrentKeywordIndex(0);
  };

  const handlePrevClick = () => {
    setCurrentKeywordIndex((prevIndex) => 
      prevIndex === 0 ? filteredKeywords.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentKeywordIndex((prevIndex) => 
      prevIndex === filteredKeywords.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (filteredKeywords.length > 0) {
      setSelectedKeyword(filteredKeywords[currentKeywordIndex]);
    }
  }, [currentKeywordIndex, filteredKeywords]);

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
                {keyword.title}
              </div>
            ))}
          </div>
          {selectedKeyword && (
            <div className='row archive-myword-info-container'>
              <div className='col-7 archive-myword-keywordcard'>
                <div className='archive-myword-keywordcard-header'>
                  Report
                </div>
                <div className='arrow-container'>
                  <button className='arrow-button' onClick={handlePrevClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-left" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
                    </svg>
                    </button>
                  <KeywordCard props={selectedKeyword} />
                  <button className='arrow-button' onClick={handleNextClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className='col-5 archive-myword-graph'>
                <div className='archive-myword-graph-header'>
                  Emotion Graph
                </div>
                <Test data={emotionData} />
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
