import React, { useEffect, useState } from 'react';
import './Response.css';
import defaultImage from '../../assets/characters/default.png'
import backgroundImage from '../../assets/clicking-background.png'


const ChatEventClicking = ({eventEnd, setIsInputDisabled})=>{
    const [numberOfClick, setNumberOfClick] = useState(Math.floor(Math.random() * 5) + 3)
    const [position, setPosition] = useState({
        top:Math.floor(Math.random()*80) + 10, 
        left:Math.floor(Math.random()*80) + 10
    })
    const [velocity, setVelocity] = useState({
        dx:(Math.floor(Math.random) < 0.5 ? -0.3 : 0.1) + Math.random() * 0.2,
        dy:(Math.floor(Math.random) < 0.5 ? -0.3 : 0.1) + Math.random() * 0.2,
    });
    const [fadeClass, setFadeClass] = useState('clicking-fade-in')

    useEffect(() => {
        if (numberOfClick > 0){
            moveImageToRandomPosition();
            setFadeClass('clicking-fade-in')
        } else {
            setFadeClass('clicking-fade-out')
            setTimeout(() => {
                handleEventEnd();
            }, 3000)
        }
    }, [numberOfClick]);

    useEffect(() => {
        const interValId = setInterval(()=>{
            setPosition(prevPosition => {
                let newTop = prevPosition.top + velocity.dy;
                let newLeft = prevPosition.left + velocity.dx;

                if (newTop <= 0 || newTop >= 70) {
                    setVelocity(prevVelocity => ({
                        ...prevVelocity,
                        dy: -prevVelocity.dy
                    }));
                    newTop = Math.max(0, Math.min(70, newTop))
                }

                if (newLeft <= 0 || newLeft >= 70) {
                    setVelocity(prevVelocity => ({
                        ...prevVelocity,
                        dx: -prevVelocity.dx
                    }));
                    newLeft = Math.max(0, Math.min(70, newLeft))
                }

                return {top: newTop, left: newLeft}
            });
        }, 20);

        return () => clearInterval(interValId);
    }, [velocity]);

    const moveImageToRandomPosition = () => {
        const randomTop = Math.floor(Math.random()*80 + 10);
        const randomLeft = Math.floor(Math.random()*80 + 10);
        const dx = (Math.random() < 0.5 ? -0.3 : 0.1) + Math.random()*0.2
        const dy = (Math.random() < 0.5 ? -0.3 : 0.1) + Math.random()*0.2
        
        setPosition({top:randomTop, left:randomLeft});
        setVelocity({dx, dy})
    };

    const handleClick = () => {
        if (numberOfClick > 0){
            setFadeClass('clicking-fade-out')
            setTimeout(()=>{
                setNumberOfClick(prev => prev-1);
                setFadeClass('clicking-fade-in')
            }, 1000)
        }
    };

    const handleEventEnd = () => {
        eventEnd();
        setIsInputDisabled(false);
    }

    return(
        <div className='chat-event-container'>
            <img src={backgroundImage} className='bouncing-ball-background' alt='background'></img>
            <div className='click-counter'>남은 클릭 수 : {numberOfClick}</div>
            {numberOfClick > 0 ? (
                <img
                    src={defaultImage}
                    alt="alt"
                    className={`click-image ${fadeClass}`}
                    style={{
                        position:'absolute',
                        top:`${position.top}%`,
                        left:`${position.left}%`
                    }}
                    onClick={handleClick}
                />
            ) : (
                <div className='event-ended clicking-fade-in'>종료되었습니다.<br/>잠시 후 대화로 넘어갑니다.</div>
            )}
        </div>
    );

}

export default ChatEventClicking;
