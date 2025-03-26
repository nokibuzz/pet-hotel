"use client";

import React, { useCallback } from "react";
import ProfileCard from "./ProfileCard";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import PreviewUserCard from "./PreviewUserCard";
import useRentModal from "@/app/hooks/useRentModal";

const ProfileContent = ({
  currentUser,
  reservations,
  pets,
  properties,
  translation,
}) => {
  const router = useRouter();
  const rentModal = useRentModal();

  const reservationDate = (reservation) => {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  };

  const onRent = useCallback(() => {
    rentModal.onOpen(translation.RentModal);
  }, [currentUser, rentModal, translation]);

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <ProfileCard currentUser={currentUser} translation={translation} />

        <div className="md:w-1/2 flex flex-col space-y-6">
          {currentUser.hotelOwner !== true && (
            <>
              <PreviewUserCard
                title="Reservations"
                items={reservations.map((reservation) => ({
                  id: reservation.id,
                  imageSrc: reservation.type.listing?.imageSrc?.[0],
                  title: reservation.type.listing?.title,
                  startDate: reservation.startDate,
                  endDate: reservation.endDate,
                }))}
                onHeaderClick={() => router.push("/reservations")}
                onItemClick={(id) => router.push(`/reservations/${id}`)}
                renderTextContent={(item) => (
                  <>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs font-light text-neutral-500">
                      {reservationDate(item)}
                    </div>
                  </>
                )}
              />

              <PreviewUserCard
                title="Pets"
                items={pets.map((pet) => ({
                  id: pet.id,
                  imageSrc: pet.imageSrc?.[0],
                  title: pet.name,
                  breed: pet.breed,
                  age: pet.age,
                }))}
                onHeaderClick={() => router.push("/pets")}
                onItemClick={(id) => console.log("Not yet implemented")}
                renderTextContent={(item) => (
                  <>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs font-light text-neutral-500">
                      {item.breed}
                    </div>
                  </>
                )}
              />
            </>
          )}

          {currentUser.hotelOwner === true && (
            <>
              <PreviewUserCard
                title="Properties"
                items={properties.map((property) => ({
                  id: property.id,
                  imageSrc: property.imageSrc?.[0],
                  title: property.title,
                  category: property.category,
                }))}
                onHeaderClick={() => router.push("/properties")}
                onItemClick={(id) => router.push(`/listing/${id}`)}
                renderTextContent={(item) => (
                  <>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs font-light text-neutral-500">
                      {item.category}
                    </div>
                  </>
                )}
                renderOwnerAddProperty={
                  <div
                    onClick={onRent}
                    className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                  >
                    Add property
                  </div>
                }
              />
            </>
          )}
        </div>
      </div>

      <div className="shadow-md rounded-lg p-6 mt-6 hover:bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">
          New Full-Width Section - Not used for now
        </div>
        <div className="text-gray-600 mt-4">Content of the section</div>
      </div>
    </div>
  );
};

export default ProfileContent;
