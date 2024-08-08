import React, { useState, useContext } from 'react';
import './AddEmotionTag.css';
import Button from '../Button/Button';
import Cookies from 'js-cookie';
import { universeVariable } from '../../App';
import axios from 'axios';


const AddEmotionTag = ({ props, setEmotionTagsRender, emotionTagsRender }) => {
  const universal = useContext(universeVariable);
  const { keyword, summary, keywordId } = props;
  const emotionTags = ['아아'];
  const [newTag, setNewTag] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    setNewTag(e.target.value);
  };

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
                  className='add-emotion-tag-input'
                  value={newTag}
                  onChange={handleInputChange}
                  placeholder='새로운 감정 태그를 추가할까요?'
                />
                <Button
                  className='btn light-btn'
                  content='Add'
                  onClick={handleSendClick}
                />
              </div>
              <p className='add-emotion-tag-guide'>잘못 입력했을 때 태그를 클릭하면 태그를 삭제할 수 있어요!</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEmotionTag;
