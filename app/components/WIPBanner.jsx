"use client";

import { useEffect, useRef } from "react";

const WIPBanner = () => {
  const textRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const text = textRef.current;
    if (text) {
      let start = window.innerWidth;
      const speed = 1;

      const animate = () => {
        start -= speed;
        if (start < -text.offsetWidth) start = window.innerWidth;
        text.style.transform = `translateX(${start}px)`;
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationRef.current);
    }
  }, []);

  return (
    <div className="w-full bg-yellow-400 py-2 overflow-hidden relative">
      <div
        ref={textRef}
        className="whitespace-nowrap text-black font-light text-sm"
      >
        Još u fazi razvoja, testiranje u toku, biće spremno za komercijalno
        korišćenje od oktobra 2025. &nbsp;|&nbsp; All rights reserved to FurLand
        team.
      </div>
    </div>
  );
};

export default WIPBanner;
