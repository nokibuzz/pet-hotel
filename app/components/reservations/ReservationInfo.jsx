"use client";

import Calendar from "../inputs/Calendar";
import Button from "../Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useCallback } from "react";

const ReservationInfo = ({
  reservationId,
  price,
  totalPrice,
  dateRange,
  translation,
}) => {
  const router = useRouter();
  const onCancel = useCallback(() => {
    setDeletingId(reservationId);

    axios
      .delete(`/api/reservations?reservationId=${reservationId}`)
      .then(() => {
        toast.success(
          translation.reservationCanceled || "Reservation cancelled!"
        );
        router.refresh();
      })
      .catch(() => {
        toast.error(translation.errorOnCancelation || "Something went wrong!");
      })
      .finally(() => {
        setDeletingId("");
      });
  }, [router]);

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {price}</div>
        <div className="font-light text-neutral-600">
          {translation.perDay || "per day"}
        </div>
      </div>
      <hr />
      <Calendar
        className="readonly-date-range"
        value={dateRange}
        readonly={true}
      />
      <hr />
      <div className="p-4">
        <Button
          label={translation.cancelReservation || "Cancel reservation"}
          onClick={onCancel}
        />
      </div>
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>{translation.total || "Total"}</div>
        <div>$ {totalPrice}</div>
      </div>
    </div>
  );
};

export default ReservationInfo;
