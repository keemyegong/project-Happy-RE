import React, { useEffect, useRef, useState } from 'react';
import './Main.css';
import art from '../../assets/characters/art.png';
import soldier from '../../assets/characters/soldier.png';
import steel from '../../assets/characters/steel.png';
import defaultImg from '../../assets/characters/default.png';
import butler from '../../assets/characters/butler.png';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Main = () => {
  const containerWrapRef = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const jumpHeight = 50;
  const jumpDuration = 1000;
  const [showUpButton, setShowUpButton] = useState(false);
  const [showDownButton, setShowDownButton] = useState(true);

  const characterImages = [art, soldier, steel, defaultImg, butler];

  useEffect(() => {
    const containerWrap = containerWrapRef.current;
    const html = document.documentElement;
    const body = document.body;

    const setHeights = () => {
      const width = containerWrap.offsetWidth;
      const height = `${width * 1.875}px`;
      containerWrap.style.height = height;
      html.style.height = height;
      body.style.height = height;
    };

    if (containerWrap) {
      setHeights();
    }

    const handleResize = () => {
      setHeights();
    };

    const handleScrollButtons = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      setShowUpButton(scrollTop > 0);
      setShowDownButton(scrollTop + clientHeight < scrollHeight);
    };
  
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScrollButtons);
    handleScrollButtons(); // 초기 상태 설정
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScrollButtons);
    };
  }, []);

  useEffect(() => {
    const initializeCanvas = (canvasRef, characters, initialPositions) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        const drawCharacters = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          characters.forEach(character => {
            ctx.drawImage(character.img, character.x, character.y, character.width, character.height);
          });
        };

        const jump = (character, delay) => {
          const startY = character.y;
          const startTime = performance.now() + delay;

          const animateJump = (time) => {
            const elapsed = time - startTime;
            if (elapsed > 0) {
              const progress = elapsed / jumpDuration;
              if (progress < 1) {
                character.y = startY - (jumpHeight * Math.sin(progress * Math.PI));
                drawCharacters();
                requestAnimationFrame(animateJump);
              } else {
                character.y = startY;
                drawCharacters();
              }
            } else {
              requestAnimationFrame(animateJump);
            }
          };

          requestAnimationFrame(animateJump);
        };

        characters.forEach((character, index) => {
          character.img.onload = () => {
            drawCharacters();
            setInterval(() => jump(character, index * 500), 5000);
          };
        });

        drawCharacters(); // Initial draw to avoid delay
      }
    };

    const initialPositions1 = [
      { x: 1.5, y: 0.5 },
      { x: 2.5, y: 0.5 },
    ];

    const initialPositions2 = [
      { x: 0.5, y: 2.5 },
      { x: 1.5, y: 2.5 },
      { x: 2.5, y: 2.5 },
    ];

    const characterSize = 150; // Fixed size for characters to maintain image quality

    const characters1 = characterImages.slice(0, 2).map((src, index) => {
      const img = new Image();
      img.src = src;
      return {
        img,
        x: initialPositions1[index].x * characterSize,
        y: initialPositions1[index].y * characterSize,
        width: characterSize,
        height: characterSize,
      };
    });

    const characters2 = characterImages.slice(2, 5).map((src, index) => {
      const img = new Image();
      img.src = src;
      return {
        img,
        x: initialPositions2[index].x * characterSize,
        y: initialPositions2[index].y * characterSize,
        width: characterSize,
        height: characterSize,
      };
    });

    initializeCanvas(canvasRef1, characters1, initialPositions1);
    initializeCanvas(canvasRef2, characters2, initialPositions2);

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'appear-from-bottom ease 5s';
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const characterBox1 = document.querySelector('.character-box-1');
    const container3 = document.querySelector('.container-3');

    if (characterBox1) observer.observe(characterBox1);
    if (container3) observer.observe(container3);

    return () => {
      if (characterBox1) observer.unobserve(characterBox1);
      if (container3) observer.unobserve(container3);
    };
  }, []);

  const handleScroll = (direction) => {
    const container1 = document.getElementById('container-1');
    const container2 = document.getElementById('container-2');
    const container3 = document.getElementById('container-3');
    let scrollAmount = 0;

    if (direction === 'down') {
      if (window.pageYOffset < container2.offsetTop) {
        scrollAmount = container2.offsetTop;
      } else if (window.pageYOffset < container3.offsetTop) {
        scrollAmount = container3.offsetTop;
      }
    } else if (direction === 'up') {
      if (window.pageYOffset >= container3.offsetTop) {
        scrollAmount = container2.offsetTop;
      } else if (window.pageYOffset >= container2.offsetTop) {
        scrollAmount = container1.offsetTop;
      }
    }

    window.scrollTo({ top: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="container-wrap" ref={containerWrapRef} data-bs-spy="scroll" data-bs-target="#navbar-example">
      {showUpButton && (
        <button className="scroll-button up" onClick={() => handleScroll('up')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
          </svg>
        </button>
      )}
      {showDownButton && (
        <button className="scroll-button down" onClick={() => handleScroll('down')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/>
          </svg>
        </button>
      )}
      <div id="container-1" className="container-1">
        <p className='main-happyre-text'>Happy:Re</p>
        <div className='to-login'>
          <Link className='text-login' to='/signin'>Login</Link>
        </div>
      </div>
      <div id="container-2" className="container-2">
        <div className='main-description1-text'>
          <p className="description-1">RE:CORD YOUR</p>
          <p className="description-2">DAILY MOOD</p>
        </div>
        <div className="character-box-1">
          <div className="characters char-section-1">
            <canvas ref={canvasRef1} style={{ display: 'block'}} />
          </div>
          <div className="information">
            <h2 className='highlight-blue'>record</h2>
            <p>바쁜 일상 속에서 놓치기 쉬운 나의 감정,</p>
            <p>이제 해피리와 함께 기록해보세요.</p>
          </div>
        </div>
      </div>
      <div id="container-3" className="container-3">
        <div className="information">
          <h2 className='highlight-blue'>mood</h2>
          <p>해피리는 당신과 함께 감정을 공유하며 기록하고,</p>
          <p>하루에 대한 레포트를 제공합니다.</p>
          <p>바쁜 일상을 마무리하고, 해피리와 함께 하루를 정리하며</p>
          <p>우리 함께 감정에 대해 알아가 볼까요?</p>
          <a className="go-login" href="/signin">
            함께할래요!
          </a>
        </div>
        <div className="characters char-section-2">
          <canvas ref={canvasRef2} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
};

export default Main;
