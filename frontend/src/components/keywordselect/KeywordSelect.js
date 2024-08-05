import React from 'react';
import './KeywordSelect.css';

const KeywordSelect = ({ isOpen, onRequestClose }) => {
  return (
    <div className={`keyword-select-modal ${isOpen ? 'open' : ''}`}>
      <div className="keyword-select-modal-content">
        <span className="close" onClick={onRequestClose}>&times;</span>
        <h2>Select Keywords</h2>
        {/* 여기에 키워드 선택 내용을 추가하세요 */}
      </div>
    </div>
  );
};

export default KeywordSelect;
