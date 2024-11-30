"use client";
import { useState } from "react";

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="relative ml-4"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block" }} // Ensures the tooltip works with inline elements
    >
      {children}
      {isVisible && (
        <div
          className="absolute bg-black text-white text-sm px-2 py-1 rounded-md"
          style={{
            left: position.x + 10, // Offset the tooltip to the right
            top: position.y - 20, // Offset the tooltip upward
            transform: "translate(-50%, -50%)", // Center the tooltip around the cursor
            pointerEvents: "none", // Prevent interfering with mouse events
            position: "fixed", // Keep the tooltip fixed relative to the viewport
            zIndex: 1000, // Ensure it appears above other elements
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
