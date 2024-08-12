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
  const animationIntervals = useRef([]);

  const characterImages = [art, soldier, steel, defaultImg, butler];

  const calculateCharacterSize = () => {
    const minWidth = 375; // 최소 너비
    const maxWidth = 1920; // 최대 너비
    const minSize = 75; // 최소 크기
    const maxSize = 200; // 최대 크기

    const currentWidth = window.innerWidth;
    const characterSize = minSize + ((maxSize - minSize) * ((currentWidth - minWidth) / (maxWidth - minWidth)));

    return Math.min(maxSize, Math.max(minSize, characterSize));
  };

  const calculateCharacterPosition = (initialPositions, characterSize) => {
    const minWidth = 375; // 최소 너비
    const maxWidth = 1920; // 최대 너비

    const currentWidth = window.innerWidth;
    const widthRatio = (currentWidth - minWidth) / (maxWidth - minWidth);

    return initialPositions.map(pos => ({
      x: pos.minX + (pos.maxX - pos.minX) * widthRatio,
      y: pos.minY + (pos.maxY - pos.minY) * widthRatio,
      width: characterSize,
      height: characterSize
    }));
  };

  const initializeCanvas = (canvasRef, characters) => {
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
          const interval = setInterval(() => jump(character, index * 500), 5000);
          animationIntervals.current.push(interval);
        };
      });

      drawCharacters(); // Initial draw to avoid delay
    }
  };

  const clearAnimationIntervals = () => {
    animationIntervals.current.forEach(interval => clearInterval(interval));
    animationIntervals.current = [];
  };

  const resizeCanvas = () => {
    clearAnimationIntervals();
    const characterSize = calculateCharacterSize(); // 반응형 캐릭터 크기

    const initialPositions1 = [
      { minX: 40, maxX: 350, minY: 50, maxY: 100 },
      { minX: 100, maxX: 550, minY: 50, maxY: 100 },
    ];

    const initialPositions2 = [
      { minX: 0, maxX: 230, minY: 150, maxY: 550 },
      { minX: 60, maxX: 370, minY: 150, maxY: 400 },
      { minX: 120, maxX: 550, minY: 150, maxY: 500 },
    ];

    const characters1 = calculateCharacterPosition(initialPositions1, characterSize).map((pos, index) => {
      const img = new Image();
      img.src = characterImages[index];
      return {
        img,
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height
      };
    });

    const characters2 = calculateCharacterPosition(initialPositions2, characterSize).map((pos, index) => {
      const img = new Image();
      img.src = characterImages[index + 2];
      return {
        img,
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height
      };
    });

    initializeCanvas(canvasRef1, characters1);
    initializeCanvas(canvasRef2, characters2);
  };

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
      resizeCanvas();
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
    resizeCanvas();

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
      clearAnimationIntervals();
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

  const handleWheel = (event) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? 'down' : 'up';
    handleScroll(direction);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="container-wrap" ref={containerWrapRef} data-bs-spy="scroll" data-bs-target="#navbar-example">
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
