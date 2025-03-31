"use client";

import Image from "next/image";

const PetInfoView = ({ pet }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 border rounded-lg shadow-sm bg-white">
      {/* Avatar & Name */}
      <div className="flex items-center gap-2">
        <Image
          src={pet?.imageSrc?.[0]}
          alt={pet?.name}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-gray-800">{pet?.name}</p>
          <p className="text-sm text-gray-500">{pet?.birth}</p>
        </div>
      </div>
    </div>
  );
};

export default PetInfoView;
