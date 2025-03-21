"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import Button from "../Button";
import useReservationModal from "@/app/hooks/useReservationModal";

const ListingReservation = ({
  listing,
  totalPrice,
  currentUser,
  translation,
}) => {
  const reservationModal = useReservationModal();
  const searchModal = useSearchModal();

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
            <div key={name} className="flex flex-row items-center gap-1">
              {showName && (
                <span className="font-light text-neutral-600">{name}: </span>
              )}
              <span className="text-sm text-neutral-800">{priceText}</span>
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
              onClick={() => reservationModal.onOpen(listing)}
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
