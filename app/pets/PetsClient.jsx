"use client";

import Container from "../components/Container";
import Heading2 from "../components/Heading2";
import PetCard from "../components/pets/PetCard";
import usePetModal from "../hooks/usePetModal";

const PetsClient = ({ pets }) => {
  const petModal = usePetModal();
  return (
    <Container>
      <div className="min-h-screen gap-6">
        <Heading2
          title="Your pets"
          subtitle="Keep track of your furry friends"
          center
        />

        <div className="my-6">
          <div className="flex justify-end items-end mb-4">
            <div
              onClick={petModal.onOpen}
              className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full bg-amber-600 text-white hover:bg-neutral-100 hover:text-black transition cursor-pointer"
            >
              Add Pet
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pets.map((pet) => {
              return (
                <PetCard
                  key={pet.id}
                  name={pet.name}
                  breed={pet.breed}
                  years={pet.age}
                  imageSrc={pet.imageSrc}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PetsClient;
