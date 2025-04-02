"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const AdvancedFiltersOption = ({
  icon: Icon,
  image = null,
  label,
  value,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(value, !selected)}
      className={`w-28 h-32 flex flex-col items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition
        ${
          selected
            ? "border-green-400 bg-green-100"
            : "border-gray-300 bg-white"
        } 
        ${selected ? "text-green-800" : "text-neutral-500"} 
        hover:border-green-400 hover:bg-green-50`}
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
      {Icon && <FontAwesomeIcon icon={Icon} size="lg" />}
      <div className="text-center font-medium text-sm">{label}</div>
    </div>
  );
};

export default AdvancedFiltersOption;
