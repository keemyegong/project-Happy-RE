import React from 'react';
import EmotionGraph from './EmotionGraph';
import './test.css';


// sampleData 연결해서 x,y 좌표 받기


const Test = ({data}) => (
  <div className='emotion-container'> 
    <EmotionGraph data={data} />
  </div>
);

export default Test;
