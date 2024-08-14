import React, { useEffect, useRef, useState } from "react";
import "./Main.css";
import art from "../../assets/characters/art.png";
import soldier from "../../assets/characters/soldier.png";
import steel from "../../assets/characters/steel.png";
import defaultImg from "../../assets/characters/default.png";
import butler from "../../assets/characters/butler.png";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Main = () => {
  const containerWrapRef = useRef(null);
  const canvasRef1 = useRef(null);
  const canvasRef2 = useRef(null);
  const jumpHeight = 50;
  const jumpDuration = 1000;
  const [scrollDirection, setScrollDirection] = useState("down");
  const [isChevronVisible, setIsChevronVisible] = useState(true);
  const animationIntervals = useRef([]);

  const characterImages = [art, soldier, steel, defaultImg, butler];

  const calculateCharacterSize = () => {
    const minWidth = 375;
    const maxWidth = 1920;
    const minSize = 75;
    const maxSize = 200;

    const currentWidth = window.innerWidth;
    const characterSize =
      minSize +
      (maxSize - minSize) * ((currentWidth - minWidth) / (maxWidth - minWidth));

    return Math.min(maxSize, Math.max(minSize, characterSize));
  };

  const calculateCharacterPosition = (initialPositions, characterSize) => {
    const minWidth = 375;
    const maxWidth = 1920;

    const currentWidth = window.innerWidth;
    const widthRatio = (currentWidth - minWidth) / (maxWidth - minWidth);

    return initialPositions.map((pos) => ({
      x: pos.minX + (pos.maxX - pos.minX) * widthRatio,
      y: pos.minY + (pos.maxY - pos.minY) * widthRatio,
      width: characterSize,
      height: characterSize,
    }));
  };

  const initializeCanvas = (canvasRef, characters) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      const drawCharacters = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        characters.forEach((character) => {
          ctx.drawImage(
            character.img,
            character.x,
            character.y,
            character.width,
            character.height
          );
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
              character.y = startY - jumpHeight * Math.sin(progress * Math.PI);
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
          const interval = setInterval(
            () => jump(character, index * 500),
            5000
          );
          animationIntervals.current.push(interval);
        };
      });

      drawCharacters();
    }
  };

  const clearAnimationIntervals = () => {
    animationIntervals.current.forEach((interval) => clearInterval(interval));
    animationIntervals.current = [];
  };

  const resizeCanvas = () => {
    clearAnimationIntervals();
    const characterSize = calculateCharacterSize();

    const initialPositions1 = [
      { minX: 40, maxX: 350, minY: 50, maxY: 70 },
      { minX: 100, maxX: 550, minY: 50, maxY: 70 },
    ];

    const initialPositions2 = [
      { minX: 0, maxX: 230, minY: 150, maxY: 550 },
      { minX: 60, maxX: 370, minY: 100, maxY: 400 },
      { minX: 120, maxX: 550, minY: 125, maxY: 500 },
    ];

    const characters1 = calculateCharacterPosition(
      initialPositions1,
      characterSize
    ).map((pos, index) => {
      const img = new Image();
      img.src = characterImages[index];
      return {
        img,
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
      };
    });

    const characters2 = calculateCharacterPosition(
      initialPositions2,
      characterSize
    ).map((pos, index) => {
      const img = new Image();
      img.src = characterImages[index + 2];
      return {
        img,
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
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
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const container3 = document.getElementById("container-3");
      const container3Top = container3.offsetTop;
      const clientHeight = document.documentElement.clientHeight;

      setScrollDirection(
        scrollTop + clientHeight < container3Top + container3.clientHeight
          ? "down"
          : "up"
      );
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScrollButtons);
    handleScrollButtons();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScrollButtons);
    };
  }, []);

  useEffect(() => {
    resizeCanvas();

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "appear-from-bottom ease 5s";
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const characterBox1 = document.querySelector(".character-box-1");
    const container3 = document.querySelector(".container-3");

    if (characterBox1) observer.observe(characterBox1);
    if (container3) observer.observe(container3);

    return () => {
      if (characterBox1) observer.unobserve(characterBox1);
      if (container3) observer.unobserve(container3);
      clearAnimationIntervals();
    };
  }, []);

  const handleScroll = (direction) => {
    const container1 = document.getElementById("container-1");
    const container2 = document.getElementById("container-2");
    const container3 = document.getElementById("container-3");
    let scrollAmount = 0;

    if (direction === "down") {
      if (window.pageYOffset < container2.offsetTop) {
        scrollAmount = container2.offsetTop;
      } else if (window.pageYOffset < container3.offsetTop) {
        scrollAmount = container3.offsetTop;
        setIsChevronVisible(false);
      }
    } else if (direction === "up") {
      if (window.pageYOffset >= container3.offsetTop) {
        scrollAmount = container2.offsetTop;
        setIsChevronVisible(true);
      } else if (window.pageYOffset >= container2.offsetTop) {
        scrollAmount = container1.offsetTop;
      }
    }

    window.scrollTo({ top: scrollAmount, behavior: "smooth" });
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? "down" : "up";
    handleScroll(direction);
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      className="container-wrap"
      ref={containerWrapRef}
      data-bs-spy="scroll"
      data-bs-target="#navbar-example"
    >
      <div id="container-1" className="container-1">
        <p className="main-happyre-text">Happy:Re</p>
        <div className="to-login">
          <Link className="text-login" to="/signin">
            Login
          </Link>
        </div>
        <button
          className={`scroll-button ${scrollDirection}`}
          onClick={() => handleScroll(scrollDirection)}
          style={{ display: isChevronVisible ? "block" : "none" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className={`bi bi-chevron-compact-${scrollDirection}`}
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d={`M1.553 ${
                scrollDirection === "down" ? "6.776" : "9.224"
              }a.5.5 0 0 1 .67-${
                scrollDirection === "down" ? ".223" : ".447"
              }L8 ${scrollDirection === "down" ? "9.44" : "6.56"}l5.776-${
                scrollDirection === "down" ? "2.888" : "2.888"
              }a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67`}
            />
          </svg>
        </button>
      </div>
      <div id="container-2" className="container-2">
        <div className="main-description1-text">
          <p className="description-1">RE:CORD YOUR</p>
          <p className="description-2">DAILY MOOD</p>
        </div>
        <div className="character-box-1">
          <div className="characters char-section-1">
            <canvas ref={canvasRef1} style={{ display: "block" }} />
          </div>
          <div className="information">
            <h2 className="highlight-blue">record</h2>
            <p>
              정신없는 일상 속에서 놓치기 쉬운 나의 감정, 이제 해피리와 함께
              기록해보세요.
            </p>
            <p>
              간단한 테스트를 통해, 해피리의 자체 AI 모델이 당신의 맞춤형
              해파리를 소개해 드릴게요.
            </p>
            <p>
              혼자서 쓰는 일기가 아닌, 해파리와 함께 이야기하면서 오늘의
              다이어리를 기록할 수 있어요.
            </p>
            <p>
              해피리는 당신과 함께 감정을 공유하며, 당신의 오늘 하루에 대한
              레포트를 제공합니다.
            </p>
          </div>
        </div>
      </div>
      <div id="container-3" className="container-3">
        <div className="information">
          <h2 className="highlight-blue">mood</h2>
          <p>
            이곳에서 나와 비슷한 무드를 지닌 친구들과 소통할 기회 역시
            제공합니다.
          </p>
          <p>
            해피리가 분석한 오늘의 다이어리를 해피리 친구들과 함께 공유해보세요.
          </p>
          <p>
            함께하는 기록 속에서 어쩌면 놓치고 있던 나의 감정을 마주할 수
            있을지도 몰라요.
          </p>
          <p>바쁜 하루를 마무리하고, 해피리와 함께 오늘을 정리해보세요.</p>
          <p>우리 함께 감정에 대해 알아가 볼까요?</p>
          <a className="go-login" href="/signin">
            함께할래요!
          </a>
        </div>
        <div id="scroll-none-section" className="characters char-section-2">
          <canvas
            ref={canvasRef2}
            style={{ display: "block", width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
