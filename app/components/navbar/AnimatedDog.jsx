import { useState } from "react";

export const gifs = {
  walkRight: [
    "https://i.pinimg.com/originals/76/91/2c/76912c075427340ae3533419fdb0da38.gif",
    "https://cdn.dribbble.com/userupload/5509318/file/original-9fcb4efd061af4c6eb3c0b056bda48d1.gif",
  ],
  walkLeft: [
    "https://i.pinimg.com/originals/dc/0f/c8/dc0fc8b0a91be10cc73696ccffd40b89.gif",
    "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0032e268-5827-4283-aa46-afc4d357c1a7/d7w6ym6-b6109fc2-fa19-4448-9f52-c393de1707a6.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzAwMzJlMjY4LTU4MjctNDI4My1hYTQ2LWFmYzRkMzU3YzFhN1wvZDd3NnltNi1iNjEwOWZjMi1mYTE5LTQ0NDgtOWY1Mi1jMzkzZGUxNzA3YTYuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.x1A1-Lit1pI71t8bdHnGibs-QdCVEJsmZy04rBhRWQ0",
  ],
  walk: [
    "https://cdn.dribbble.com/userupload/5509318/file/original-9fcb4efd061af4c6eb3c0b056bda48d1.gif",
    "https://i.pinimg.com/originals/dc/0f/c8/dc0fc8b0a91be10cc73696ccffd40b89.gif",
  ],
  center: [
    "https://i.pinimg.com/originals/79/4d/33/794d334ba72f7b8232eb5ca7ec24d3d4.gif",
    "https://assets-v2.lottiefiles.com/a/07b7d7b0-1176-11ee-9d4d-0ba5a0b1a0e9/j5Kh3c4kpu.gif",
    "https://i.gifer.com/embedded/download/Qw5v.gif",
    "https://media.tenor.com/46RZqU97nkAAAAAj/dog-treat.gif",
  ],
};

const AnimatedDog = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isGoingRight, setIsGoingRight] = useState(true);
  const [currentGif, setCurrentGif] = useState(gifs.walkRight[0]);

  const [showCenterGif, setShowCenterGif] = useState(false);

  const handleAnimationEnd = () => {
    setIsGoingRight((prev) => !prev);
    setCurrentGif(() =>
      isGoingRight
        ? gifs.walkLeft[Math.floor(Math.random() * gifs.walkLeft.length)]
        : gifs.walkRight[Math.floor(Math.random() * gifs.walkRight.length)]
    );
  };

  const handleClick = () => {
    if (isPaused) return;

    setIsPaused(true);

    const randomCenterGif =
      gifs.center[Math.floor(Math.random() * gifs.center.length)];

    setShowCenterGif(true);
    setCurrentGif(randomCenterGif);

    setTimeout(() => {
      setShowCenterGif(false);
      setCurrentGif(() =>
        isGoingRight
          ? gifs.walkRight[Math.floor(Math.random() * gifs.walkRight.length)]
          : gifs.walkLeft[Math.floor(Math.random() * gifs.walkLeft.length)]
      );
      setIsPaused(false);
    }, 2000); // Show the center GIF for 2 seconds
  };

  return (
    <div
      className="relative w-full h-12 md:h-18 overflow-hidden"
      onClick={handleClick}
    >
      {showCenterGif && (
        <img
          src={currentGif}
          alt="Center GIF"
          className="absolute h-full object-contain"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        />
      )}
      {!showCenterGif && (
        <img
          src={currentGif}
          alt="Cartoon dog walking"
          className={`absolute h-full object-contain ${
            isGoingRight ? "animate-left-to-right" : "animate-right-to-left"
          }`}
          onAnimationEnd={handleAnimationEnd}
        />
      )}
      <style jsx>{`
        @keyframes leftToRight {
          from {
            left: 0%;
          }
          to {
            left: 100%;
          }
        }
        @keyframes rightToLeft {
          from {
            left: 100%;
          }
          to {
            left: 0%;
          }
        }
        .animate-left-to-right {
          animation: leftToRight 8s linear;
        }
        .animate-right-to-left {
          animation: rightToLeft 8s linear;
        }
      `}</style>
    </div>
  );
};

export default AnimatedDog;
