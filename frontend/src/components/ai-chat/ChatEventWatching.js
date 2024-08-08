import React, { useEffect, useState } from 'react';
import './Response.css';
import backgroundImg from "../../assets/bounce_ball_wallpaper.png"
import ballImg from "../../assets/bouncing_ball.png"
import Timer from "../timer/Timer";

const ChatEventWatching = ()=>{
    const [balls, setBalls] = useState([]);
    const [numberOfBall, setNumberOfBalls] = useState(Math.floor(Math.random() * 5) + 3);
    // const numberOfBall = 5


    useEffect(() => {
        let ballList = []
        for (let i = 0; i<numberOfBall; i++){
            const x = Math.random() * 50 + 20;
            const y = Math.random() * 50 + 20;
            const dx = (Math.random() < 0.5 ? -1 : 0.5) + (Math.random() * 0.5);
            const dy = (Math.random() < 0.5 ? -1 : 0.5) + (Math.random() * 0.5);
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

    return(
        <div className='bouncing-ball-container'>
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
