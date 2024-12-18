"use client";

import React from "react";
import ProfileCard from "./profile/ProfileCard";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import PreviewUserCard from "./profile/PreviewUserCard";

const TabContent = ({ currentUser, reservations, pets }) => {
  const router = useRouter();

  const reservationDate = (reservation) => {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <ProfileCard currentUser={currentUser} />

        <div className="md:w-1/2 flex flex-col space-y-6">
          <PreviewUserCard
            title="Reservations"
            items={reservations.map((reservation) => ({
              id: reservation.id,
              imageSrc: reservation.listing.imageSrc,
              title: reservation.listing.title,
              startDate: reservation.startDate,
              endDate: reservation.endDate,
            }))}
            onHeaderClick={() => router.push("/reservations")}
            onItemClick={(id) => router.push(`/reservations/${id}`)}
            renderContent={(item) => (
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
              imageSrc: pet.imageSrc,
              title: pet.name,
              breed: pet.breed,
              age: pet.age,
            }))}
            onHeaderClick={() => router.push("/pets")}
            onItemClick={(id) => console.log("Not yet implemented")}
            renderContent={(item) => (
              <>
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-xs font-light text-neutral-500">
                  {item.breed}
                </div>
              </>
            )}
          />
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

export default TabContent;
