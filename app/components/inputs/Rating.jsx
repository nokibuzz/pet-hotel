"use client";

import { useState } from "react";
import { FaPaw } from "react-icons/fa";

const Rating = ({ label, value = 1, onChange, disabled }) => {
  const [hoveredValue, setHoveredValue] = useState(null);

  const handleClick = (newValue) => {
    if (!disabled) {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (newValue) => {
    if (!disabled) {
      setHoveredValue(newValue);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredValue(null);
    }
  };

  const renderPaws = () => {
    const paws = [];
    for (let i = 1; i <= 5; i++) {
      const isFull = (hoveredValue || value) >= i;
      const isHalf =
        (hoveredValue || value) >= i - 0.5 && (hoveredValue || value) < i;

      paws.push(
        <div
          key={i}
          className={`relative justify-between flex-shrink-0 text-xl sm:text-2xl lg:text-3xl ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          style={{
            margin: "0 5px",
            position: "relative",
            width: "1.5em",
            height: "1.5em",
          }}
        >
          {/* Full Paw */}
          <FaPaw
            className={`absolute top-0 left-0 ${
              isFull ? "text-yellow-500" : "text-neutral-500"
            }`}
          />
          {/* Half Paw */}
          <FaPaw
            className={`absolute top-0 left-0 ${
              isHalf ? "text-yellow-500" : "text-transparent"
            }`}
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
          {/* Clickable Half Areas */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full"
            onClick={() => handleClick(i - 0.5)}
            onMouseEnter={() => handleMouseEnter(i - 0.5)}
            onMouseLeave={handleMouseLeave}
            style={{ zIndex: 1 }}
          />
          <div
            className="absolute top-0 right-0 w-1/2 h-full"
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            style={{ zIndex: 1 }}
          />
        </div>
      );
    }
    return paws;
  };

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="text-mb text-neutral-500">{label}</div>
      <div className="flex items-center justify-between gap-2">
        {renderPaws()}
      </div>
    </div>
  );
};

export default Rating;
