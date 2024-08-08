import React, { useEffect, useState } from 'react';
import './Response.css';
import backgroundImg from "../../assets/bounce_ball_wallpaper.png"
import ballImg from "../../assets/bouncing_ball.png"

const ChatEventWatching = ()=>{
    const [balls, setBalls] = useState([]);
    const numberOfBall = Math.floor(Math.random() * 5) + 3
    // const numberOfBall = 1


    useEffect(() => {
        let ballList = []
        for (let i = 0; i<numberOfBall; i++){
            const x = Math.random() * 50 + 20;
            const y = Math.random() * 50 + 20;
            const dx = (Math.random() * 2 - 1) * 0.0001;
            const dy = (Math.random() * 2 - 1) * 0.0001;
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

                    if (x <= 0 || x >= 100) {
                        dx = -dx;
                        x = Math.max(10, Math.min(90, x));
                    }
                    if (y <= 0 || y >= 100) {
                        dy = -dy;
                        y = Math.max(10, Math.min(90, y));
                    }

                    return {x, y, dx, dy};
                })
            );
        }, 30);

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
