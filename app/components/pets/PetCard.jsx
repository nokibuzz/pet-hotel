"use client";

import usePetViewModal from "@/app/hooks/usePetViewModal";
import Image from "next/image";

const PetCard = ({ pet, translation }) => {
  const petViewModal = usePetViewModal();

  return (
    <div
      className="bg-white rounded-md shadow-md cursor-pointer"
      onClick={() => petViewModal.onOpen(pet)}
    >
      <Image
        width={1000}
        height={1000}
        src={pet.imageSrc?.[0]}
        alt="Pet"
        className="w-full h-100 object-cover rounded-md hover:scale-105 transition"
      />
      <div className="p-4">
        <div className="mt-2 text-xl font-bold">{pet.name}</div>
        <div className="text-gray-600">
          {translation[pet.breed] || pet.breed}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
