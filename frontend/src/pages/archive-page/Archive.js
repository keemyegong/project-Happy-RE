import React, { useState, useEffect,useContext, } from 'react';
import './Archive.css';
import KeywordCard from '../../components/diary-report/KeywordCard';
import Test from '../../components/emotion-graph/Test';
import axios from 'axios';
import { universeVariable } from '../../App';
import Cookies from 'js-cookie';
import MessageCard from '../../components/message-card/MessageCard';
import Swal from 'sweetalert2'


const Archive = () => {
  const universal = useContext(universeVariable);
  const [messages, setMessages] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [dummyKeywords, setDummyKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [emotionData, setEmotionData] = useState([]);
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [filteredKeywords, setFilteredKeywords] = useState([]);

  const getMessage = ()=>{
    axios.get(
      `${universal.defaultUrl}/api/archived`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }).then((response)=>{
        console.log(response.data.userMessageEntityList);
        setMessages(response.data.userMessageEntityList.map((element)=>{
          return {...element}
        }));
      })
  }

  const deleteArchived = (messageId)=>{
    Swal.fire({
      title: '메시지를 정리 할까요?',
      text: '한 번 삭제한 메시지는 다시 만나는 게 힘들지도 몰라요...',
      icon: "question",
      iconColor: "#4B4E6D",
      color: 'white',
      background: '#292929',
      confirmButtonColor: '#4B4E6D',
      showCancelButton: true,
      cancelButtonColor: "#333758",
      confirmButtonText: "삭제",
      cancelButtonText: "취소"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '성공적으로 메시지를 정리했습니다!',
          // text: '',
          icon: "success",
          iconColor: "#4B4E6D",
          color: 'white',
          background: '#292929',
          confirmButtonColor: '#4B4E6D',
        }).then((result)=>{
          setMessages([...messages].filter((Element)=>{
            return Element.userMessageId != messageId
          }))
          delteArchive(messageId);
        });
      } else{
      }
    })

  }


  const delteArchive = (messageId)=>{
    axios
    .delete(
      `${universal.defaultUrl}/api/usermsg/archive/${messageId}`,
      { headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` } }
    )
    .then((Response)=>{
      console.log('successfully unarchive');
    })
  }

  useEffect(() => {
    getMessage();


    const dummyKeywordsData = [
      { id: 1, title: '워터파크', date: '2024-08-02', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 2, title: '두꺼비', date: '2024-08-03', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 3, title: '담배', date: '2024-08-04', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 4, title: '워터파크', date: '2024-08-05', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 5, title: '니코틴', date: '2024-08-06', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 6, title: '카페인', date: '2024-08-07', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 7, title: '워터파크', date: '2024-08-08', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 8, title: '아쿠아리움', date: '2024-08-09', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
      { id: 9, title: '담배', date: '2024-08-10', content: "This is a summary example of keywords. It's going to come out roughly like this. I have nothing more to say.", emotionTags: ['#기쁨', '#신남', '#행복'] },
    ];

    setDummyKeywords(dummyKeywordsData);

    const uniqueKeywords = dummyKeywordsData.reduce((acc, keyword) => {
      if (!acc.some(kw => kw.title === keyword.title)) {
        acc.push(keyword);
      }
      return acc;
    }, []);

    setKeywords(uniqueKeywords);

    if (dummyKeywordsData.length > 0) {
      setSelectedKeyword(dummyKeywordsData[0]);
      setFilteredKeywords(dummyKeywordsData.filter(kw => kw.title === dummyKeywordsData[0].title));
    }
  }, []);

  const handleKeywordClick = (keyword) => {
    setSelectedKeyword(keyword);
    const filtered = dummyKeywords.filter(kw => kw.title === keyword.title);
    setFilteredKeywords(filtered);
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
            <span class='archive-mywords-guide'>
              내가 보관한 감정 키워드에 대한 기록을 볼 수 있어요
            </span>
          </div>
          <div className="archive-mywords-content">
            {keywords.map((keyword) => (
              <div
                className='archive-keyword'
                key={keyword.id}
                onClick={() => handleKeywordClick(keyword)}
                style={{
                  fontWeight: selectedKeyword?.title === keyword.title ? '800' : 'normal',
                  opacity: selectedKeyword?.title === keyword.title ? '1' : '0.7'
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
                {filteredKeywords.length > 1 && (
                  <div className='keywordcard-arrow-container'>
                    <div className='keywordcard-arrow-button' onClick={handlePrevClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
                      </svg>
                    </div>
                    <KeywordCard props={selectedKeyword} />
                    <div className='keywordcard-arrow-button' onClick={handleNextClick}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
                      </svg>
                    </div>
                  </div>
                )}
                {filteredKeywords.length <= 1 && (
                  <KeywordCard props={selectedKeyword} />
                )}
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
            <span class='archive-mywords-guide'>
              내가 보관한 메시지들을 확인할 수 있어요
            </span>
          </div>
          <div className="archive-message-content">
            {messages.map((message) => {
              
                return <MessageCard
                  key={message.userMessageId}
                  messageId={message.userMessageId}
                  persona={message.userEntity.myfrog}
                  keyword={message.userMessageAttachedKeywordEntityList[0]}
                  content={message.content}
                  archived={true}
                  deleteArchived={deleteArchived}

                />
              
            })} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archive;
