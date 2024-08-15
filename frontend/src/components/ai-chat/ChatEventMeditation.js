import React,{useState, useEffect} from 'react';
import './Response.css';
import background from '../../assets/명상화면.png'
import Timer from '../timer/Timer';

const textList = ["잠시 눈을 감고 심호흡을 해봐요", 
	"오늘 하루는 어땠나요?", 
	"천천히 숨을 내쉬어 보세요",
	"주변에서는 어떤 소리가 나고 있나요?",
	"지금 느껴지는 향기가 있나요?"
	];

const ChatEventMeditation = ({eventEnd})=>{
	const [currentText, setCurrentText] = useState(textList[0]);
	const [fadeProp, setFadeProp] = useState('meditation-text-fadein');
	const [textIdx, setTextIdx] = useState(0)
	const fadeInDuration = 3000; // 페이드인 지속 시간 (3초)
	const displayDuration = 2000; // 텍스트 표시 시간 (3초)
	const fadeOutDuration = 3000; // 페이드아웃 지속 시간 (3초)
	const totalDuration = fadeInDuration + displayDuration + fadeOutDuration;
	
	const image = background
	useEffect(()=>{

		const interval = setInterval(()=>{
			setFadeProp('meditation-text-fadeout');

			setTimeout(()=>{
				setTextIdx(prevIdx => {
					const newIdx = (prevIdx + 1) % textList.length
					setCurrentText(textList[newIdx]);
					return newIdx
				})
				setFadeProp('meditation-text-fadein')
			},fadeInDuration)

		},totalDuration)

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
