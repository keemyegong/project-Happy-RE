import React, { useState, useContext, useEffect } from "react";
import { universeVariable } from "../../App";
import axios from "axios";
import "./UserProfile.css";
import Cookies from "js-cookie";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import userProfileImage from "../../assets/sampleUserImage.jpg";
import WordCloud from "react-d3-cloud";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import Calendar from "../../components/calander/Calander";
import EmotionGraph from "../../components/emotion-graph/EmotionGraph";
import * as echarts from "echarts";
import "echarts-wordcloud";
import Swal from "sweetalert2";
import DiaryDetail from "../../components/diary-report/DiaryDetail";
import PersonaChangeModal from "../../components/persona-change-modal/PersonaChangeModal";
import artist from "../../assets/characters/art.png";
import butler from "../../assets/characters/butler.png";
import defaultPersona from "../../assets/characters/default.png";
import soldier from "../../assets/characters/soldier.png";
import steel from "../../assets/characters/steel.png";
import LoadingProfileImagae from '../../assets/loading-7528_512.gif'


import heartimg from "../../assets/heart-fill.svg"

const UserProfile = () => {
  const happyRelist = [defaultPersona, soldier, butler, steel, artist];
  const happyReHello = [
    "당신의 마음을 편하게 해주는 작은 기쁨이 필요하다면 언제든지 말씀해 주세요. 함께 해결해 나갈 수 있을 거예요.",
    "인생은 치열한 전장과도 같지! 이 전투를 이겨내기 위한 전략을 함께 고민해보자꾸나.",
    "주인님, 하루 일과를 체계적으로 정리해 볼까요? 작은 성취들이 쌓이면 큰 성과로 이어질 것입니다.",
    "삶의 의미를 찾는 여정에서 함께 길을 나서보지 않겠나. 깊이 있는 대화가 그대의 마음을 밝히리라 믿네.",
    "(미소 지으며) 모든 이야기는 그대의 삶에서 중요한 장면이랍니다. 그 장면들을 나와 함께 살펴보며 마음의 평화를 찾아보아요.",
  ];

  const happyReGoDiary = [
    "아직 오늘의 다이어리를 작성하지 않으셨네요! 함께 오늘 하루를 돌아보며 이야기 나눠볼까요?",
    "전사여, 오늘은 어떤 전투에 임했는가? 오늘의 치열한 하루에 대해 보고하게나!",
    "주인님, 오늘 하루는 어떻게 보내셨나요? 어떤 부분에서 어려움을 겪으셨는지 말씀해 주시면 제가 도와드릴 수 있을 것 같아요.",
    "오늘 그대의 하루는 어떠했는가? 나와 함께 오늘 하루를 되짚으며 고찰해보는 것은 어떤가?",
    "(미소를 지으며) 오늘 하루는 어떤 이야기를 만들어 나갔나요? 저와 함께 오늘의 장면들을 이야기해 볼까요?",
  ];

  const [image, setImage] = useState(LoadingProfileImagae);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [words, setWords] = useState("");
  const [emotionData, setEmotionData] = useState([]);
  const [data, setData] = useState([]);
  const universal = useContext(universeVariable);
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setMonth(today.getMonth() - 1);
  const [keyword, setKeyword] = useState([]);
  const [chatlog, setChatlog] = useState([]);
  const [daySummary, setDaySummary] = useState("");
  const [showDiary, setShowDiary] = useState(false);
  const [selectedDay, setSelectedDay] = useState(today);
  const [possibleList, setPossibleList] = useState([]);
  const [recentList, setRecentList] = useState([]);
  const [changeClass,setChangeClass] = useState('valid-container')
  const [renderCloud, setRenderCloud] = useState(true);


  const [classNamee, setClassName] = useState("nodata");

  const [validCloud, setValidCloud] = useState(false);
  let possibleDates = [];
  let recentinfo = [];

  let navigate = useNavigate();
  const heartImageUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTggMS4zMTRDMTIuNDM4LTMuMjQ4IDIzLjUzNCA0LjczNSg0KjAgOCAxNS03LjUzNCA0Ljc2MyAzLjU2Mi0zLjI0OCA4IDEuMzE0Ii8+PC9zdmc+';

  const [show, setShow] = useState(false);
  const [keywordEntities, setKeywordEntities] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const balloonImage = new Image();
  balloonImage.src = "../../assets/wordimg.svg"; // 말풍선 이미지 경로
  const getClassName = () => {
    return classNamee;
  };
  const getRecentMonthDiary = () => {
    axios.get(
      `${universal.defaultUrl}/api/diary/?year=${monthAgo.getFullYear()}&month=${monthAgo.getMonth() + 1}&day=${monthAgo.getDate()}&period=${32}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('Authorization')}`,
          withCredentials: true,
        }
      }).then((response) => {
        response.data.filter((element) => { return element.russellAvgX != null && element.russellAvgY != null }).forEach((element) => {
          recentinfo.push({ x: element.russellAvgX, y: element.russellAvgY, value: 0.8 })
        });
        setRecentList(recentinfo);
      });
  };

  const getDiary = (year, month, date) => {
    axios
      .get(
        `${universal.defaultUrl}/api/diary/?year=${year}&month=${month}&day=${date}&period=1`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("Authorization")}`,
            withCredentials: true,
          },
        }
      )
      .then((response) => {
        if (response.data[0] != undefined) {
          setDaySummary(response.data[0].summary);
          const example = response.data[0].diaryId;

          axios
            .get(
              `${universal.defaultUrl}/api/diary/detail/?diaryid=${response.data[0].diaryId}`,
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("Authorization")}`,
                  withCredentials: true,
                },
              }
            )
            .then((response) => {
              setKeyword(response.data.keywordEntities);
              setChatlog(response.data.messageEntities);
              setShowDiary(true);
            });
        } else {
          Swal.fire({
            title: "다이어리가 없습니다!",
            text: "해파리가 열심히 찾아봤지만, 안타깝게도 해당 날짜에는 하루를 기록한 흔적이 없는 것 같아요.",
            icon: "question",
            iconColor: "#4B4E6D",
            color: "white",
            background: "#292929",
            confirmButtonColor: "#4B4E6D",
          });
        }
      });
  };

  const showDiaryModal = (date) => {
    getDiary(date.getFullYear(), date.getMonth() + 1, date.getDate());
  };

  const getMonthlyDiary = (startDate) => {
    const last = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    axios
      .get(
        `${
          universal.defaultUrl
        }/api/diary/?year=${startDate.getFullYear()}&month=${
          startDate.getMonth() + 1
        }&day=1&period=${last.getDate()}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("Authorization")}`,
            withCredentials: true,
          },
        }
      )
      .then((response) => {
        response.data.forEach((element) => {
          possibleDates.push(element.date.substring(0, 10));
        });
        if (possibleDates.length !== possibleList.length) {
          setPossibleList(possibleDates);
        }
      });
  };
  const heartShape = `M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314`;
  const img = new Image();
  useEffect(() => {
    // setImage(userProfileImage);
    universal.setIsAuthenticated(true);
    getMonthlyDiary(today);
    getRecentMonthDiary();
    
    setTimeout(()=>{

    axios
      .get(`${universal.defaultUrl}/api/user/me`, {
        headers: { Authorization: `Bearer ${Cookies.get("Authorization")}` },
      })
      .then((Response) => {
        setNickname(Response.data.name);
        setEmail(Response.data.email);
        localStorage.setItem("personaNumber", Response.data.myfrog);
      })
      .then(() => {
        axios
          .get(`${universal.defaultUrl}/api/user/profileimg`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("Authorization")}`,
            },
            responseType: "blob",
          })
          .then((Response) => {
            const blobData = new Blob([Response.data], { type: "image/jpeg" });
            const url = window.URL.createObjectURL(blobData);

            setImage(url);
          })
          .catch(() => {
            setImage(userProfileImage);
          });
      })
      .catch(() => {

        console.log("서버와통신불가");
      });
    
    },100);
    axios
      .get(`${universal.defaultUrl}/api/wordcloud/mywords`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Authorization")}`,
        },
      })
      .then((response) => {
        const responseData = response.data;
        img.src = heartimg;
        if (responseData != ''){
          setValidCloud(true);
        }
        const wordCloudData = responseData.map((item) => ({
          name: item.word,
          value: item.frequency, // frequency에 대한 가중치 적용
        }));
        const sortedTop100Data = wordCloudData
          .sort((a, b) => b.value - a.value)  // `value`를 기준으로 내림차순 정렬
          .slice(0, 50);                     // 상위 100개 데이터만 추출

        setData(sortedTop100Data);
        console.log("WordCloudData : ", sortedTop100Data);
        if (sortedTop100Data.length==0){
          // setChangeClass('wordcloud-container');
          setRenderCloud(false);
          console.log('aa')
        } else{
          const chartElement = document.getElementById("wordCloud");

      
          if (chartElement) {
            // chartElement가 존재하는지 확인
            const chart = echarts.init(chartElement);
            setClassName("havedata");
            // ECharts 옵션 설정
            chart.setOption({
              tooltip: {
                show: true,  // 툴팁을 활성화
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                formatter: function (params) {
                  return `<div class="echarts-tooltip">
                        <strong>${params.name}</strong> : ${params.value}
                      </div>`;
                }
              },
              series: [
                {
                  type: "wordCloud",
                  keepAspect: false,
                  shape: "circle",
                  offsetCenter: [0, -100],
                  sizeRange: [10, 40], // 글자 크기 범위
                  rotationRange: [-90, 90], // 글자의 회전 범위
                  gridSize: 10, // 글자 간격
                  drawOutOfBound: false,
                  textStyle: {
                    fontFamily: "Pretendard",
                    fontWeight: 400,
                    // Color can be a callback function or a color string
                    color: function () {
                      // Random color
                      return (
                        "rgb(" +
                        [
                          Math.round(Math.random() * 50 + 50), // R: 중간 값 (50-100)
                          Math.round(Math.random() * 50 + 100), // G: 중간-높은 값 (100-150)
                          Math.round(Math.random() * 100 + 150), // B: 높은 값 (150-255)
                        ].join(",") +
                        ")"
                      );
                    },
                  },
                  emphasis: {
                    focus: "self",
  
                    textStyle: {
                      textShadowBlur: 10,
                      textShadowColor: "#333",
                    },
                  },
  
                  data: sortedTop100Data,
                },
              ],
            });
            setData(sortedTop100Data)
            
  
          } else {
            console.error('DOM element with id "wordCloud" not found.');
          }
        }

        // 차트를 초기화할 DOM 요소 선택
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      });

    axios
      .get(`${universal.defaultUrl}/api/diary/detail/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("Authorization")}`,
        },
      })
      .then((response) => {
        const { messageEntities } = response.data;
        const processedData = messageEntities
          .filter(
            (message) => message.russellX !== null && message.russellY !== null
          )
          .map((message) => ({
            x: message.russellX,
            y: message.russellY,
            value: 0.8,
          }));
        setEmotionData(processedData);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      });
  }, []);

  const showModal = () => {
    setShow(!show);
  };

  const changePersona = (happyreNumber) => {
    localStorage.setItem("personaNumber", happyreNumber);
    axios.put(
      `${universal.defaultUrl}/api/user/me`,
      {
        myfrog: happyreNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("Authorization")}`,
        },
      }
    );
    setShow(false);
  };

  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

  return (
    <div>

      <div className="container-fluid user-profile-container">
        <div className="row">
          <div className="col-12 col-md-4 col-xxl-2 ">
            <div className="default-info">
              <div className="user-avatar">
                <img className="profile-page-user-image" src={image} alt="profile" />
              </div>
              <div className="default-info-container">
                <p className="nickname">{nickname}</p>
                {/* <p className="email">{email}</p> */}
                <Button
                  className="profile-edit-btn btn light-btn small ms-0"
                  content="Edit Profile"
                  onClick={() => {
                    navigate("/user/update");
                  }}
                />
              </div>
            </div>
          </div>
          <div className="user-profile-info-container col-12 col-md-8 col-xxl-10">
            <div className="user-emotion-info-container row">
              <div className="col-12 col-xxl-6">
                <div className="profile-mywords-title text-white">
                  <p className="profile-mywords-title-text">My Words</p>
                  <span className="profile-mywords-guide">
                    내가 자주 사용하는 어휘들을 통해서 나의 감정을 돌아볼 수
                    있어요
                  </span>
                </div>
                <div style={{margin: "auto"}}>
                  {renderCloud && <div id="wordCloud"style={{opacity: "0.9", width: "100%", height: "260px" }}  className={changeClass} ></div>}
                  {data.length === 0 && (
                    <p className="wordcloud-none-word">
                      아직 나의 단어가 없어요! 다이어리를 작성하러 갈까요?
                      
                    </p>
                  )}
                </div>
                <div className="my-5 calender-container">
                  <Calendar
                    possibleList={possibleList}
                    showDiaryModal={showDiaryModal}
                    getMonthlyDiary={getMonthlyDiary}
                    setSelectedDay={setSelectedDay}
                  />
                  {/* <span className="profile-calender-guide"> 달력을 통해 월간 기록을 바로 확인할 수 있어요! </span> */}
                </div>
              </div>
              <div className="user-emotion-info-container col-12 col-xxl-6">
                <div className="profile-emotion-title text-white">
                  <p className="profile-emotion-title-text">Emotion Graph</p>
                  <span className="profile-mywords-guide">
                    최근 한 달 나의 감정을 그래프를 통해 알아볼 수 있어요
                    <br />
                    X축은 긍정도, Y축은 각성도를 나타내요
                  </span>
                </div>
                <div className="emotion-graph-container">
                  <EmotionGraph data={recentList} />
                </div>

                <div className="change-happyre-persona">
                  <div className="persona-chat-container">
                    {" "}
                    <div className="persona-chat">
                      {keywordEntities == null
                        ? happyReGoDiary[localStorage.getItem("personaNumber")]
                        : happyReHello[localStorage.getItem("personaNumber")]}
                      {keywordEntities == null && (
                        <p className="persona-diary-add-btn m-0">
                          <Button
                            className="btn dark-btn small"
                            content="다이어리 작성하러 갈래!"
                            onClick={() => navigate("/diary")}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="persona-image-container">
                    <img
                      className="happyre-persona-image"
                      alt="해파리 페르소나"
                      src={happyRelist[localStorage.getItem("personaNumber")]}
                    />
                    <span className="happyre-change-guid">* 펜 모양의 버튼을 클릭하면 다른 해파리와 대화할 수 있어요!</span>
                    <div className="persona-change-button" onClick={showModal}>
                      <span className="material-symbols-outlined">edit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PersonaChangeModal
        show={show}
        handleClose={handleClose}
        changePersona={changePersona}
      />

      <div className="modal-container">
        {showDiary && (
          <DiaryDetail
            daySummary={daySummary}
            chatlog={chatlog}
            keyword={keyword}
            selectedDay={
              {year:selectedDay.getFullYear(),
              month:selectedDay.getMonth()+1,
              date:selectedDay.getDate()
            }

            }
            onClose={() => setShowDiary(false)}
            hideplus={true}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
