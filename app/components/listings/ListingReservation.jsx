"use client";

import Button from "../Button";
import useReservationModal from "@/app/hooks/useReservationModal";

const ListingReservation = ({
  listing,
  price,
  totalPrice,
  dateRange,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  translation,
}) => {
  const reservationModal = useReservationModal();

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {price}</div>
        <div className="font-light text-neutral-600">
          {translation.perDay || "per day"}
        </div>
      </div>
      <hr />
      {/* <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
        locale={translation.locale || "sr"}
      />
      <hr /> */}
      <div className="p-4">
        <Button
          disabled={disabled}
          label={translation.reserve || "Reserve"}
          onClick={() => reservationModal.onOpen(listing)}
        />
      </div>
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>{translation.total || "Total"}</div>
        <div>$ {totalPrice}</div>
      </div>
    </div>
  );
};

export default ListingReservation;
