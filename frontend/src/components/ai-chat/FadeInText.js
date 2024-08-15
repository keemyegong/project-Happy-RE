import React,{useState, useEffect} from 'react';
import './Response.css';

const textList = ["현재 방에는 혼자만 있어요", "마음에 여유를 가지고 누군가가 들어오길 기다려볼까요?", "혼자 있을 때 주로 무엇을 하며 지내나요?", "이런 시간엔 자신에게 집중해보는 것도 좋아요."];

const FadeinText = ()=>{
	const [currentText, setCurrentText] = useState(textList[0]);
	const [fadeProp, setFadeProp] = useState('meditation-text-fadein');
	const fadeInDuration = 3000; // 페이드인 지속 시간 (3초)
	const displayDuration = 2000; // 텍스트 표시 시간 (3초)
	const fadeOutDuration = 3000; // 페이드아웃 지속 시간 (3초)

	useEffect(()=>{

		const interval = setInterval(()=>{
			setFadeProp('meditation-text-fadeout');

			setTimeout(()=>{
				setCurrentText(textList[ Math.floor(Math.random() * 4)]);
				setFadeProp('meditation-text-fadein')
			},3000)

		},7000)

		return () => clearInterval(interval);
	},[])

	
	return(
		<div className='fadein-text-container'>
			<p className={fadeProp} meditation-text>{currentText}</p>
		</div>

	);

}

export default FadeinText;
