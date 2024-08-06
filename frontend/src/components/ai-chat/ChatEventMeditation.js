import React,{useState, useEffect} from 'react';
import './Response.css';
import background from '../../assets/명상화면.png'
import Timer from '../timer/Timer';

const textList = ["잠시 눈을 감고 심호흡을 해봐요", 
	"오늘 하루는 어땠나요?", 
	"뭔가 적당히 명상할때 나오면좋은", "텍스트같은거없나"];

const ChatEventMeditation = ({eventEnd})=>{
	const [currentText, setCurrentText] = useState(textList[0]);
	const [fadeProp, setFadeProp] = useState('meditation-text-fadein');
	const fadeInDuration = 3000; // 페이드인 지속 시간 (3초)
	const displayDuration = 2000; // 텍스트 표시 시간 (3초)
	const fadeOutDuration = 3000; // 페이드아웃 지속 시간 (3초)
	const totalDuration = fadeInDuration + displayDuration + fadeOutDuration;
	
	const image = background
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
		<div className='meditation-container'>
			<Timer/>
			<p className={fadeProp} meditation-text>{currentText}</p>
			<img src={image} className='meditation-img' />
		</div>

	);

}

export default ChatEventMeditation;
