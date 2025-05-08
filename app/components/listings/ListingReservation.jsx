"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import Button from "../Button";
import useReservationModal from "@/app/hooks/useReservationModal";
import { useEffect } from "react";
import { useGlobal } from "@/app/hooks/GlobalContext";

const ListingReservation = ({
  listing,
  totalPrice,
  currentUser,
  translation,
}) => {
  const reservationModal = useReservationModal();
  const searchModal = useSearchModal();
  const { pets, fetchPetsForUser } = useGlobal();

  useEffect(() => {
    if (currentUser) {
      fetchPetsForUser(currentUser.id);
    }
  }, [currentUser]);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="p-4">
        {listing?.types?.map(({ name, defaultPrice, weekendPrice }) => {
          const showName = searchModal?.type !== name;
          const priceText = `${defaultPrice} RSD ${
            translation.perDay || "per day"
          }${
            weekendPrice !== defaultPrice
              ? ` (${weekendPrice} RSD ${
                  translation.onWeekend || "on weekend"
                })`
              : ""
          }`;

          return (
            <div
              key={name}
              className="flex flex-col items-center gap-0.5 text-center"
            >
              {showName && (
                <span className="text-sm text-neutral-600 font-light">
                  {translation.type[name] || name}:
                </span>
              )}
              <span className="text-sm text-neutral-800 font-medium">
                {priceText}
              </span>
            </div>
          );
        })}
      </div>
      {currentUser?.id !== listing?.userId && (
        <>
          <hr />
          <div className="p-4">
            <Button
              label={translation.reserve || "Reserve"}
              onClick={() => reservationModal.onOpen(listing, pets)}
            />
          </div>
          {totalPrice && (
            <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
              <div>{translation.total || "Total"}</div>
              <div>$ {totalPrice}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListingReservation;
