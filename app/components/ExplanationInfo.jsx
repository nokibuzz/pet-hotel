"use client";

import { useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const ExplanationInfo = ({
  text,
  size = 20,
  horizontalPosition = "left",
  verticalPosition = "up",
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const horizontalClass =
    horizontalPosition === "right" ? "left-0 right-auto" : "right-0 left-auto";
  const verticalClass =
    verticalPosition === "down" ? "top-full mt-2" : "bottom-full mb-2";

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <AiOutlineQuestionCircle
        size={size}
        className="text-gray-500 cursor-pointer hover:text-gray-700"
      />

      {/* Popup Tooltip */}
      {isHovered && (
        <div
          className={`absolute ${horizontalClass} ${verticalClass} w-60 p-2 bg-white shadow-lg border rounded-lg z-10 text-sm text-gray-700 max-h-40 overflow-y-auto whitespace-normal`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default ExplanationInfo;
