"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';

const AdvancedFiltersButton = ({ selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer border rounded-lg ${
        selected ? "border-neutral-800" : "border-gray-300"
      } ${selected ? "text-neutral-800" : "text-neutral-500"}`}
    >
      <FontAwesomeIcon icon={faSliders} size="lg" className="text-neutral-500" />
      <div className="font-normal text-xs">Filters</div>
    </div>
  );
};

export default AdvancedFiltersButton;
