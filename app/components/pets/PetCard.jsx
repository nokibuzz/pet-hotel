"use client";

import Image from "next/image";

const PetCard = ({ name, imageSrc, breed, years, translation }) => {
  return (
    <div className="bg-white rounded-md shadow-md">
      <Image
        width={1000}
        height={1000}
        src={imageSrc}
        alt="Pet"
        className="w-full h-100 object-cover rounded-md"
      />
      <div className="p-4">
        <div className="mt-2 text-xl font-bold">{name}</div>
        <div className="text-gray-600">{breed}</div>
        <div className="text-gray-400">
          {years} {translation.yearsOld || "years young"}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
