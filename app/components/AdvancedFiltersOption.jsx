"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdvancedFiltersOption = ({ icon: Icon, label, selected, onClick }) => {
  return (
    <div
      onClick={() => onClick(label, !selected)}
      className={`flex flex-col items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition
        ${selected ? "border-green-400 bg-green-100" : "border-gray-300 bg-white"} 
        ${selected ? "text-green-800" : "text-neutral-500"} 
        hover:border-green-400 hover:bg-green-50`}
    >
      <FontAwesomeIcon icon={Icon} size="lg" />
      <div className="font-medium text-sm">{label}</div>
    </div>
  );
};

export default AdvancedFiltersOption;