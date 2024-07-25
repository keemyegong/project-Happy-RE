import React from 'react';
import EmotionGraph from './EmotionGraph';
import './test.css';


// sampleData 연결해서 x,y 좌표 받기
const sampleData = [
  { x: -0.6, y: -0.6, value: 0.8 }, // 점 좌표와 세기값 세기값은 0.8 고정
  { x: -0.5, y: -0.5, value: 0.8 },
  { x: -0.6, y: -0.4, value: 0.8 },
  { x: -0.8, y: -0.8, value: 0.8 },
  { x: -0.6, y: -0.9, value: 0.8 },
];

const Test = () => (
  <div className='emotion-container'> 
    <EmotionGraph data={sampleData} />
  </div>
);

export default Test;
