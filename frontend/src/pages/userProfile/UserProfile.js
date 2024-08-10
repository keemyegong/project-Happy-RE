import React, { useState, useContext, useEffect } from 'react';
import { universeVariable } from '../../App';
import axios from 'axios';
import './UserProfile.css';
import Cookies from 'js-cookie';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import userProfileImage from '../../assets/sampleUserImage.jpg';
import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import Calendar from '../../components/calander/Calander';
import EmotionGraph from '../../components/emotion-graph/EmotionGraph';
import Swal from 'sweetalert2'
import DiaryDetail from '../../components/diary-report/DiaryDetail';


import artist from '../../assets/characters/art.png';
import butler from '../../assets/characters/butler.png';
import defaultPersona from '../../assets/characters/default.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';

import { Modal } from 'react-bootstrap';

const UserProfile = () => {
  
  const happyRelist = [defaultPersona, soldier, butler, steel, artist];
  const happyReHello = [
    "당신의 마음을 편하게 해주는 작은 기쁨이 필요하다면 언제든지 말씀해 주세요. 함께 해결해 나갈 수 있을 거예요.",
    "인생은 치열한 전장과도 같지! 이 전투를 이겨내기 위한 전략을 함께 고민해보자꾸나.",
    "주인님, 하루 일과를 체계적으로 정리해 볼까요? 작은 성취들이 쌓이면 큰 성과로 이어질 것입니다.",
    "삶의 의미를 찾는 여정에서 함께 길을 나서보지 않겠나. 깊이 있는 대화가 그대의 마음을 밝히리라 믿네.",
    "(미소 지으며) 모든 이야기는 그대의 삶에서 중요한 장면이랍니다. 그 장면들을 나와 함께 살펴보며 마음의 평화를 찾아보아요."
  ];

  const happyReGoDiary = [
    "아직 오늘의 다이어리를 작성하지 않으셨네요! 함께 오늘 하루를 돌아보며 이야기 나눠볼까요?",
    "전사여, 오늘은 어떤 전투에 임했는가? 오늘의 치열한 하루에 대해 보고하게나!",
    "주인님, 오늘 하루는 어떻게 보내셨나요? 어떤 부분에서 어려움을 겪으셨는지 말씀해 주시면 제가 도와드릴 수 있을 것 같아요.",
    "오늘 그대의 하루는 어떠했는가? 나와 함께 오늘 하루를 되짚으며 고찰해보는 것은 어떤가?",
    "(미소를 지으며) 오늘 하루는 어떤 이야기를 만들어 나갔나요? 저와 함께 오늘의 장면들을 이야기해 볼까요?"
  ];

  const [image, setImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [words, setWords] = useState('');
  const [emotionData, setEmotionData] = useState([]);
  const [data, setData] = useState([]);
  const universal = useContext(universeVariable);
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setMonth(today.getMonth()-1);
  const [keyword, setKeyword] = useState([])
  const [chatlog, setChatlog] = useState([])
  const [daySummary, setDaySummary] = useState('');
  const [showDiary, setShowDiary] = useState(false); 
  const [selectedDay, setSelectedDay] = useState(today);
  const [possibleList, setPossibleList] = useState([]);
  const [recentList, setRecentList] = useState([]);
  let possibleDates = [];
  let recentinfo = [];


  let navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [keywordEntities, setKeywordEntities] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getRecentMonthDiary = ()=>{
    axios.get(
      `${universal.defaultUrl}/api/diary/?year=${monthAgo.getFullYear()}&month=${monthAgo.getMonth()+1}&day=${monthAgo.getDate()}&period=${31}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }).then((response)=>{
        response.data.filter((element)=>{ return element.russellAvgX!=null && element.russellAvgY!=null}).forEach((element)=>{
          recentinfo.push({x:element.russellAvgX, y:element.russellAvgY, value:0.8})
        })
        setRecentList(recentinfo);

      })
  }

  const getDiary = (year, month, date)=>{
    axios.get(
      `${universal.defaultUrl}/api/diary/?year=${year}&month=${month}&day=${date}&period=1`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }).then((response)=>{

        if (response.data[0] != undefined){
          // console.log(response.data);
          setDaySummary(response.data[0].summary);
          const example = response.data[0].diaryId;

          axios.get(
            `${universal.defaultUrl}/api/diary/detail/?diaryid=${response.data[0].diaryId}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('Authorization')}`,
                withCredentials: true,
              }
            }).then((response)=>{
              
              console.log(response.data.messageEntities);
              setKeyword(response.data.keywordEntities);
              setChatlog(response.data.messageEntities);

              setShowDiary(true);
            })
          } else {
            Swal.fire({
              title: '다이어리가 없습니다!',
              text: '해파리가 열심히 찾아봤지만, 안타깝게도 해당 날짜에는 하루를 기록한 흔적이 없는 것 같아요.',
              icon: "question",
              iconColor: "#4B4E6D",
              color: 'white',
              background: '#292929',
              confirmButtonColor: '#4B4E6D',
            });
            
          }
      })
  }

  const showDiaryModal = (date)=>{
    getDiary(date.getFullYear(),date.getMonth()+1,date.getDate());
  }

  const getMonthlyDiary = (startDate)=>{
    const last = new Date(startDate.getFullYear(),startDate.getMonth()+1,0);
    axios.get(
      `${universal.defaultUrl}/api/diary/?year=${startDate.getFullYear()}&month=${startDate.getMonth()+1}&day=1&period=${last.getDate()}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }).then((response)=>{
        response.data.forEach(element => {
          possibleDates.push(element.date.substring(0,10));
          
        });
        if (possibleDates.length !== possibleList.length){
          setPossibleList(possibleDates);
        }
      })
  }
  useEffect(() => {
    setImage(userProfileImage);
    universal.setIsAuthenticated(true);
    getMonthlyDiary(today);
    getRecentMonthDiary();

    axios.get(`${universal.defaultUrl}/api/user/me`, {
      headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` }
    }).then((Response) => {
      console.log(Response.data);
      setNickname(Response.data.name);
      setEmail(Response.data.email);
      localStorage.setItem("personaNumber", Response.data.myfrog);
    }).then(() => {
      axios.get(`${universal.defaultUrl}/api/user/profileimg`, {
        headers: { Authorization: `Bearer ${Cookies.get('Authorization')}` },
        responseType: 'blob',
      }).then((Response) => {
        const blobData = new Blob([Response.data], { type: 'image/jpeg' });
        const url = window.URL.createObjectURL(blobData);
        setImage(url);
      }).catch(() => {
        console.log('이미지 파일이 존재하지 않습니다.');
        setImage(userProfileImage);
      });


    }).catch(()=>{
      console.log('서버와통신불가')
    })


    
    axios.get(`${universal.defaultUrl}/api/wordcloud/mywords`,
      {headers:{
          Authorization : `Bearer ${Cookies.get('Authorization')}`
      }}
      ).then((response)=>{
        const responseData = response.data; 
        console.log(responseData)

        const keywordMap = new Map();
      
        responseData.forEach(item => {
          const { word, frequency } = item;
          keywordMap.set(word, frequency);
        });
      
        const keywordObject = Object.fromEntries(keywordMap);
        console.log(keywordObject);
      
        const wordCloudData = Object.keys(keywordObject).map(keyword => ({
          text: keyword,
          value: keywordObject[keyword] * 3 // frequency에 대한 가중치
        }))

        setData(wordCloudData);
      }).catch(error => {
        // 에러가 발생했을 때 실행할 코드
        if (error.response) {
            // 서버가 응답을 반환했을 때 (4xx, 5xx 응답 코드)
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
        } else if (error.request) {
            // 요청이 만들어졌으나 서버로부터 응답이 없을 때
            console.error('No response received:', error.request);
        } else {
            // 요청을 설정하는 중에 에러가 발생했을 때
            console.error('Error setting up request:', error.message);
        }
      })


    // 이모션 데이터
    axios.get(`${universal.defaultUrl}/api/diary/detail/`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('Authorization')}`
      }
    }).then((response) => {
      console.log('요청 데이터', response.data)
      const { messageEntities } = response.data;
      const processedData = messageEntities
        .filter(message => message.russellX !== null && message.russellY !== null)
        .map(message => ({
          x: message.russellX,
          y: message.russellY,
          value: 0.8
        })
      );
      setEmotionData(processedData);
      console.log("이모션 데이터", emotionData)
    }).catch(error => {
      // 에러가 발생했을 때 실행할 코드
      if (error.response) {
        // 서버가 응답을 반환했을 때 (4xx, 5xx 응답 코드)
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        // 요청이 만들어졌으나 서버로부터 응답이 없을 때
        console.error('No response received:', error.request);
      } else {
        // 요청을 설정하는 중에 에러가 발생했을 때
        console.error('Error setting up request:', error.message);
      }
    });
  }, []);


  const showModal = () => {
    setShow(show === 'show-modal' ? 'unshow-modal' : 'show-modal');
  }

  const changePersona = (happyreNumber) => {
    localStorage.setItem("personaNumber", happyreNumber);
    axios.put(`${universal.defaultUrl}/api/user/me`, {
      myfrog: happyreNumber,
    }, {
      headers: {
        Authorization: `Bearer ${Cookies.get('Authorization')}`
      }
    })
    setShow(show === 'show-modal' ? 'unshow-modal' : 'show-modal');
  }

  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

  
  return (
    <>
      <div className='container-fluid user-profile-container'>
        <div className='row'>
          <div className='col-12 col-md-4 col-xxl-2 '>
            <div className='default-info'>
              <div className='user-avatar'>
                <img className='profile-image' src={image} />
              </div>
              <div className='default-info-container'>
                <p className='nickname'>{nickname}</p>
                <p className='email'>{email}</p>
                <Button className='profile-edit-btn btn light-btn small' content='Edit Profile' onClick={() => {
                  navigate('/user/update')
                }} />
              </div>
            </div>
          </div>
          <div className='col-12 col-md-8 col-xxl-10'>
            <div className='user-emotion-info-container row'>
              <div className='col-12 col-xxl-6'>
              <div class='profile-mywords-title text-white'>
                <p class='profile-mywords-title-text'>My Words</p>
                <span class='profile-mywords-guide'>
                  내가 자주 사용하는 어휘들을 통해서 나의 감정을 돌아볼 수 있어요
                </span>
              </div>
              <div className='wordcloud-container'>
                  {data.length > 0 ? (
                    <WordCloud
                      data={data}
                      width={300}
                      height={100}
                      font="Times"
                      fontWeight="bold"
                      fontSize={(word) => Math.log2(word.value) * 2.2}
                      spiral="rectangular"
                      padding={5}
                      fill={(d, i) => {
                        const rand = Math.floor(Math.random() * 10);
                        return `rgba(215,218,249,${1 - rand * 0.07})`;
                      }}
                    />
                  ) : (
                    <p className='wordcloud-none-word'>아직 나의 단어가 없어요! 다이어리를 작성하러 갈까요?</p>
                  )}
                </div>
                <div className='my-5 calender-container'>
                  <Calendar 
                    possibleList={possibleList}
                    showDiaryModal={showDiaryModal}
                    getMonthlyDiary={getMonthlyDiary}
                  />
                </div>
              </div>
              <div className='col-12 col-xxl-6'>
                <div className='profile-emotion-title text-white'>
                  <p className='profile-emotion-title-text'>Emotion Graph</p>
                  <span class='profile-mywords-guide'>
                    최근 한 달 나의 감정을 그래프를 통해 알아볼 수 있어요
                    <br/>
                    X축은 긍정도, Y축은 각성도를 나타내요
                  </span>
                </div>
                <div className='emotion-graph-container'>
                  <EmotionGraph data={recentList} />
                </div>

                <div className='change-happyre-persona my-5'>
                  {/* 해피리 페르소나 영역 */}
                  <div className='persona-chat-container'>
                    <div className='persona-chat'>
                      {keywordEntities == null ? happyReGoDiary[localStorage.getItem('personaNumber')] : happyReHello[localStorage.getItem('personaNumber')]}
                      {keywordEntities == null && (
                        <p className='persona-diary-add-btn m-0'>
                        <Button className='btn dark-btn small' content='다이어리 작성하러 갈래!' onClick={() => navigate('/diary')} />
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='persona-image-container'>
                    <img className='happyre-persona-image' alt='해파리 페르소나' src={happyRelist[localStorage.getItem('personaNumber')]} />
                    <div className='persona-change-button' onClick={showModal}>
                      <span className="material-symbols-outlined">
                        edit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={show}>
        <div className='happyre-persona-change-container'>
          <div className='row row-cols-2 row-cols-lg-3 justify-content-center'>
            <div className='col'>
              <div className='happyre-persona-icon-container' onClick={() => { changePersona(0) }}>
                <img src={happyRelist[0]} className='happyre-choice-preview' />
                <div className='happyre-persona-info'>
                  <div className='happyre-persona-info-title'>
                    해피리
                  </div>
                  <div className='happyre-persona-info-description'>
                    안녕하세요! 해피리예요.
                    오늘은 어떤 일이 있으셨나요? 기분이나 마음이 무거우신가요?
                    <br />
                    제가 도와드릴 수 있는 게 있다면 말씀해 주세요.
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='happyre-persona-icon-container' onClick={() => { changePersona(1) }}>
                <img src={happyRelist[1]} className='happyre-choice-preview' />
                <div className='happyre-persona-info'>
                  <div className='happyre-persona-info-title'>
                    해파린 장군
                  </div>
                  <div className='happyre-persona-info-description'>
                    안녕하신가, 전사여. 오늘 그대의 마음이 무거운 듯하네. 어떤 고민이 있는지 말해보거라.
                    <br />
                    내가 도울 수 있는 방법을 찾아보겠네.
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='happyre-persona-icon-container' onClick={() => { changePersona(2) }}>
                <img src={happyRelist[2]} className='happyre-choice-preview' />
                <div className='happyre-persona-info'>
                  <div className='happyre-persona-info-title'>
                    해파스찬
                  </div>
                  <div className='happyre-persona-info-description'>
                    안녕하세요, 주인님! 오늘 하루는 어떻게 보내셨나요?
                    <br />
                    어떤 부분에서 어려움을 겪으셨는지 말씀해주시면
                    <br />
                    제가 도와드릴 수 있을 것 같아요.
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='happyre-persona-icon-container' onClick={() => { changePersona(3) }}>
                <img src={happyRelist[3]} className='happyre-choice-preview' />
                <div className='happyre-persona-info'>
                  <div className='happyre-persona-info-title'>
                    해파라테스
                  </div>
                  <div className='happyre-persona-info-description'>
                    안녕하신가. 오늘 하루는 어떠했나.
                    <br />
                    삶의 의미에 대해 생각하기 좋은 날이었나?
                    <br />
                    어떤 생각들이 그대의 마음을 채우고 있는지 궁금하네.
                  </div>
                </div>
              </div>
            </div>
            <div className='col'>
              <div className='happyre-persona-icon-container' onClick={() => { changePersona(4) }}>
                <img src={happyRelist[4]} className='happyre-choice-preview' />
                <div className='happyre-persona-info'>
                  <div className='happyre-persona-info-title'>
                    셰익스피리
                  </div>
                  <div className='happyre-persona-info-description'>
                    (깊이 생각하며) 우리의 무대는 삶의 거울이라네.
                    <br />
                    그대의 영혼에 잠든 이야기를 깨워,
                    <br />
                    어떤 상념들이 그대를 사로잡고 있는지 들여다보게나!
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button className='btn light-btn small' content='Close' onClick={showModal} />
        </div>
      </div>
      <div className='modal-container'>
        {showDiary && (
          <DiaryDetail 
            daySummary={daySummary}
            chatlog={chatlog}
            keyword={keyword}
            selectedDay={selectedDay} // 전체 날짜 정보 전달
            onClose={() => setShowDiary(false)}
            hideplus={true}
          />
        )}
      </div>
    </>
  );
}

export default UserProfile;
