"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CategoryInput = ({ label, icon: Icon, onClick, selected, value }) => {
  return (
    <div
      onClick={() => onClick(value)}
      className={`rounded-xl border-2 p-4 flex flex-col gap-3 hover:border-black transition cursor-pointer ${
        selected ? "border-black" : "border-neutral-200"
      }`}
    >
      <FontAwesomeIcon icon={Icon} size="2xl" className="text-neutral-500" />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
