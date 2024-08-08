import React, { useState, useContext } from 'react';
import './AddEmotionTag.css';
import Button from '../Button/Button';
import Cookies from 'js-cookie';
import { universeVariable } from '../../App';
import axios from 'axios';
import Swal from 'sweetalert2'

const AddEmotionTag = ({ props, setEmotionTagsRender, emotionTagsRender }) => {
  const universal = useContext(universeVariable);
  const { keyword, summary, keywordId } = props;
  const emotionTags = ['아아'];
  const [newTag, setNewTag] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    if (e.target.value.length<=10){
      setNewTag(e.target.value);
    } else{
      setIsFormValid(false);
    }

  };

  const confirmClick = ()=>{

    if (newTag.length>0){
      Swal.fire({
        title: '키워드에 감정을 추가할까요?',
        text: '한 번 추가한 감정은 삭제할 수 없어요! 신중하게 고민해보셨나요?',
        icon: "info",
        iconColor: "#4B4E6D",
        color: 'white',
        background: '#292929',
        confirmButtonColor: '#4B4E6D',
        showCancelButton: true,
        cancelButtonColor: "#333758",
        confirmButtonText: "네! 추가할래요!",
        cancelButtonText: "조금만 더 생각할래요!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: '성공적으로 감정을 추가했어요!',
            text: '소중한 감정을 해파리가 힘내서 기록할게요!',
            icon: "success",
            iconColor: "#4B4E6D",
            color: 'white',
            background: '#292929',
            confirmButtonColor: '#4B4E6D',
          }).then((result)=>{
            handleSendClick();
            return true
          }).then((response)=>{
            setShowModal(false);
          });
        }
      });
    } else{
      Swal.fire({
        title: '감정이 비어있어요!',
        text: '키워드를 보고 어떤 생각이 떠오르셨나요? 자유롭게 적어봐요!',
        icon: "question",
        iconColor: "#4B4E6D",
        color: 'white',
        background: '#292929',
        confirmButtonColor: '#4B4E6D',
      });
    }
  }

  const handleSendClick = () => {
    // 백엔드로 요청 보내기
    axios.post(`${universal.defaultUrl}/api/keyword/emotion`, 
      {
        keywordId:keywordId,
        emotion:newTag,
      },
      {headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('Authorization')}`,

      },
    })
      .then(response => 
        {
          const tmp_tags = [...emotionTagsRender];
          tmp_tags.push(newTag);
          setEmotionTagsRender(tmp_tags);
          console.log(response.data);
        }
      )
      .then(data => {
        setNewTag('');
        console.log('Success:', data);
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <button 
        className='emotion-tag-add-button' 
        onClick={() => setShowModal(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
      </button>
      {showModal && (
        <div className='add-emotion-tag-keyword-modal'>
          <div className='add-emotion-tag-keyword-modal-backdrop' onClick={() => setShowModal(false)}></div>
          <div className='add-emotion-tag-keyword-modal-content'>
              <span className='keyword-modal-close-btn' onClick={() => setShowModal(false)}>&times;</span>
            <div className='add-emotion-tag-container'>
              <div className='add-emotion-tag-keyword-title'>{keyword}</div>
              <div className='add-emotion-tag-keyword-content'>{summary}</div>
              <p className='add-emotion-tag-keyword-line'></p>
              <div className='add-emotion-tag-existing-tags'>
                {emotionTags.map((tag, index) => (
                  <span key={index} className='add-emotion-tag'>{tag}</span>
                ))}
              </div>
              <div className='add-emotion-tag-input-container'>
                <input
                  type='text'
                  className={`add-emotion-tag-input`}
                  value={newTag}
                  onChange={handleInputChange}
                  placeholder='최대 10자까지 입력할 수 있어요!'
                />
                <Button
                  className='btn light-btn'
                  content='Add'
                  onClick={confirmClick}
                />
              </div>
              <p className='add-emotion-tag-guide'>한 번 입력한 감정은 삭제할 수 없으니 신중하게 생각해봐요!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmotionTag;
