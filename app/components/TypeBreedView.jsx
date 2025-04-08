"use client";

import { PET_BREEDS, PET_DESCRIPTIONS } from "../utils/PetConstants";

const TypeBreedView = ({
  originalTypeName,
  typeName,
  breed,
  breedDescription,
  additionalInfo = null,
}) => {
  const icon = PET_BREEDS[originalTypeName]?.icon || "";
  const description = breedDescription || PET_DESCRIPTIONS[breed] || "-";

  return (
    <div className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-sm bg-white">
      {/* Type and breed */}
      <div className="flex items-center gap-2">
        <div>{icon}</div>
        <div>
          <p className="font-semibold text-gray-800">{typeName}</p>
          <p className="text-sm text-amber-800">{breed}</p>
        </div>
      </div>

      <hr className="w-full" />

      {/* Description */}
      <div className="text-center sm:text-right">
        <p className="text-sm">{description}</p>
      </div>

      {/* Additional Info */}
      {additionalInfo && (
        <>
          <hr className="w-full" />
          <div className="text-center sm:text-right">
            <p className="text-sm">{additionalInfo}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default TypeBreedView;
