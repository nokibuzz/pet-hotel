"use client";

import { useState } from "react";
import ReservationRow from "./ReservationRow";

const ReservationGroupInfo = ({ reservations, currentUser, translation }) => {
  const groupedReservations = reservations.reduce((acc, reservation) => {
    const listingId = reservation.type.listing.id;
    if (!acc[listingId]) {
      acc[listingId] = [];
    }
    acc[listingId].push(reservation);
    return acc;
  }, {});

  const [openStates, setOpenStates] = useState(
    Object.keys(groupedReservations).reduce((acc, listingId) => {
      acc[listingId] = true; // Default: all open
      return acc;
    }, {})
  );

  const toggleOpen = (listingId) => {
    setOpenStates((prev) => ({
      ...prev,
      [listingId]: !prev[listingId],
    }));
  };

  return (
    <div className="mt-10  space-y-4">
      {Object.entries(groupedReservations).map(([listingId, ress]) => {
        return (
          <div
            key={listingId}
            className="border border-gray-300 rounded-lg p-2"
          >
            <button
              onClick={() => toggleOpen(listingId)}
              className="w-full flex justify-between items-center font-semibold p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              <span>{ress[0].type.listing.title}</span>
              <span>Num of reservations: {ress.length}</span>
            </button>
            {openStates[listingId] && (
              <div className="mt-2 space-y-2">
                {ress.map((reservation) => (
                  <ReservationRow
                    key={reservation.id}
                    data={reservation}
                    actionId={reservation.id}
                    actionLabel={
                      reservation.type.listing.hasCancelation
                        ? translation.ListingCard.cancelReservation ||
                          "Cancel reservation"
                        : translation.ListingCard
                            .cancelReservationNotPossbile ||
                          "Cancelation not possible"
                    }
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReservationGroupInfo;
