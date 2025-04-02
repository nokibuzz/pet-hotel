"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const CategoryInput = ({
  label,
  icon: Icon,
  image = null,
  onClick,
  selected,
  value,
  tooltip,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  let pressTimer = null;

  // Function to start long press detection
  const handleTouchStart = () => {
    pressTimer = setTimeout(() => {
      setIsLongPress(true);
    }, 500); // Long press duration
  };

  // Function to clear long press detection
  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
    setIsLongPress(false);
  };

  return (
    <div
      onClick={() => onClick(value)}
      className={`w-full rounded-xl border-2 p-4 flex flex-col gap-3 items-center hover:border-black transition cursor-pointer ${
        selected ? "border-gray-900 text-gray-900" : "border-neutral-200"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {image && (
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={image}
            alt={label}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      {Icon && (
        <FontAwesomeIcon
          icon={Icon}
          size="2xl"
          className={`${selected ? "text-gray-900" : "text-neutral-500"}`}
        />
      )}
      <div className="font-semibold">{label}</div>

      {(isHovered || isLongPress || selected) && tooltip && (
        <div className="text-xs text-gray-600">{tooltip}</div>
      )}
    </div>
  );
};

export default CategoryInput;
