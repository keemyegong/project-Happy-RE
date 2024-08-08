import React, { useEffect, useState } from 'react';
import './Response.css';
import backgroundImg from "../../assets/bounce_ball_wallpaper.png"
import ballImg from "../../assets/bouncing_ball.png"
import Timer from "../timer/Timer";

const textList = [
    "공들의 움직임에 집중해보세요",
    "해피해피",
    "테스트 문장 3번"
]

const ChatEventWatching = ()=>{
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
            const dx = (Math.random() < 0.5 ? -0.75 : 0.75) + (Math.random() * 0.25);
            const dy = (Math.random() < 0.5 ? -0.75 : 0.75) + (Math.random() * 0.25);
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

                    if (x <= 5 || x >= 90) {
                        dx = -dx;
                        x = Math.max(5, Math.min(90, x));
                    }
                    if (y <= 5 || y >= 90) {
                        dy = -dy;
                        y = Math.max(5, Math.min(90, y));
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

    return(
        <div className='bouncing-ball-container'>
            <Timer/>
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
