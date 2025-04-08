"use client";

import Modal from "./Modal";
import TypeBreedView from "../TypeBreedView";
import usePetViewModal from "@/app/hooks/usePetViewModal";
import ScrollableImages from "../ScrollableImages";

const PetViewModal = ({ translation = {} }) => {
  const petViewModal = usePetViewModal();

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <ScrollableImages images={petViewModal?.pet?.imageSrc} />
      <hr />
      <TypeBreedView
        originalTypeName={petViewModal?.pet?.typeName}
        typeName={
          translation?.type?.[petViewModal?.pet?.typeName] ||
          petViewModal?.pet?.typeName
        }
        breed={
          translation?.breed?.[petViewModal?.pet?.breed] ||
          petViewModal?.pet?.breed
        }
        breedDescription={petViewModal?.pet?.description}
        additionalInfo={petViewModal?.pet?.additionalInfo}
      />
      <div
        className="border-2 rounded-lg shadow-sm p-2 flex items-center justify-center gap-2 
        bg-white cursor-pointer hover:bg-amber-500 text-black hover:text-white"
        onClick={() => petViewModal.onClose()}
      >
        <span>{translation?.close || "Close"}</span>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={petViewModal.isOpen}
      onClose={() => {
        petViewModal.onClose();
      }}
      title={petViewModal?.pet?.name}
      showFooter={false}
      body={bodyContent}
    />
  );
};

export default PetViewModal;
