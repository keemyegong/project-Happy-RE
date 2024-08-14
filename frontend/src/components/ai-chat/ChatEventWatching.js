import React, { useEffect, useState } from 'react';
import './Response.css';
import './ChatBox.css';
import backgroundImg from "../../assets/bounce_ball_wallpaper.png"
import ballImg from "../../assets/bouncing_ball.png"

const textList = [
    "공들의 움직임에 집중해보세요",
    "눈으로 공을 따라가 보세요",
    "마음을 비우세요"
]

const ChatEventWatching = ({eventEnd,setIsInputDisabled})=>{
    const [balls, setBalls] = useState([]);
    const [numberOfBall, setNumberOfBalls] = useState(Math.floor(Math.random() * 5) + 3);
    const [currentText, setCurrentText] = useState(textList[0]);
    const [textIndex, setTextIndex] = useState(0);
    const [fadeProp, setFadeProp] = useState('boncing-ball-fade-in');
    const fadeInDuration = 3000;
    const displayDuration = 2000;
    const fadeOutDuration = 3000;
    const totalDuration = fadeInDuration + fadeOutDuration + displayDuration;

    useEffect(() => {
        let ballList = []
        for (let i = 0; i<numberOfBall; i++){
            const x = Math.random() * 50 + 20;
            const y = Math.random() * 50 + 20;
            const dx = (Math.random() < 0.5 ? -0.5 : 0.5) + (Math.random() * 0.2);
            const dy = (Math.random() < 0.5 ? -0.5 : 0.5) + (Math.random() * 0.2);
            ballList.push({x, y, dx, dy});
        };
        setBalls(ballList);
    }, [numberOfBall]);

    useEffect(() => {
        const interValid = setInterval(()=>{
            setBalls(prevBalls =>
                prevBalls.map(ball => {
                    let {x, y, dx, dy } = ball

                    x += dx;
                    y += dy;

                    if (x <= 5 || x >= 85) {
                        dx = -dx;
                        x = Math.max(5, Math.min(85, x));
                    }
                    if (y <= 5 || y >= 85) {
                        dy = -dy;
                        y = Math.max(5, Math.min(85, y));
                    }

                    return {x, y, dx, dy};
                })
            );
        }, 20);

        return () => clearInterval(interValid);
    }, []);

    useEffect(()=>{
        setFadeProp('bouncing-ball-fade-in');

        const textInterval = setInterval(() => {
            setFadeProp('bouncing-ball-fade-out');
            setTimeout(() => {
                setTextIndex(prev => {
                    const newIndex = (prev + 1) % textList.length;
                    setCurrentText(textList[newIndex]);
                    return newIndex;
                })
                setFadeProp('bouncing-ball-fade-in');
            }, fadeOutDuration);
        }, totalDuration);

        return () => clearInterval(textInterval);
    }, []);

    const handleEventEndClick = () => {
        setTimeout(()=>{
            eventEnd();
            setIsInputDisabled(false);
        }, 0)
    }

    return(
        <div className='chat-event-container clicking-container'>
            <div className='event-quit' onClick={() => {handleEventEndClick()}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </div>
            <p className={fadeProp}>{currentText}</p>
            <img src={backgroundImg} className='bouncing-ball-background' alt='background'></img>
            {balls.map((ball, index) => (
                <img key={index} src={ballImg} alt={`ball ${index+1}`}
                className='bouncing-ball'
                style={{
                    left:`${ball.x}%`,
                    top:`${ball.y}%`
                }}/>
            ))}
        </div>
    );

}

export default ChatEventWatching;
