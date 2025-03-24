"use client";

import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import ActionButton from "../ActionButton";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import useReservationInfoModal from "@/app/hooks/useReservationInfoModal";
import ReservationStatusField from "./ReservationStatusField";

const ReservationRow = ({ data, disabled, currentUser, translation }) => {
  const router = useRouter();
  const reservationInfoModal = useReservationInfoModal();

  const reservationId = data?.id;
  const type = data?.type;
  const listing = type?.listing;

  const onSelect = (event) => {
    event.stopPropagation(); // Stops the parent onClick from firing
    router.push(`/reservations/${reservationId}`);
  };

  const reservationDate = useMemo(() => {
    if (!data) {
      return null;
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [data]);

  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-between w-full p-4 bg-white shadow-lg rounded-lg border border-gray-200 transition-transform duration-200 hover:scale-105 hover:cursor-pointer">
      {/* Main Content */}
      <div
        className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left sm:items-center gap-4 sm:gap-6 w-full border-gray-300 flex-wrap sm:flex-nowrap"
        onClick={() => reservationInfoModal.onOpen(data)}
      >
        {/* Left - Image & Title */}
        <div
          className="flex items-center gap-2 min-w-0 hover:scale-110 hover:cursor-pointer border border-transparent hover:border-gray-600 rounded-lg mx-2 my-1 p-2 transition duration-200"
          onClick={(event) => onSelect(event)}
        >
          <Image
            src={listing.imageSrc?.[0]}
            alt={listing.title}
            width={50}
            height={50}
            className="rounded-md"
          />
          <span className="font-semibold text-gray-700 truncate max-w-[120px] sm:max-w-none">
            {listing.title}
          </span>
        </div>

        {/* Center - Date */}
        <div className="text-gray-600 text-center">
          <span className="block whitespace-nowrap sm:text-center sm:max-w-none">
            {reservationDate}
          </span>
          <span className="block text-sm text-green-500">
            {data.totalPrice} RSD
          </span>
        </div>

        {/* Right - User Info */}
        <div className="hidden sm:flex flex-col items-center text-center">
          <Image
            src={data?.user?.image ?? "/images/placeholder.png"}
            alt={data?.user?.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-gray-700 truncate max-w-[100px] sm:max-w-none">
            {data?.user?.name}
          </span>
          <span className="text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">
            {type.name}
          </span>
          <span className="text-sm text-amber-700 truncate max-w-[150px] sm:max-w-none">
            {data.breed}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {listing.userId === currentUser?.id && (
        <div className="flex flex-row sm:flex-col gap-2 items-center justify-center min-w-[120px] p-2 w-full sm:w-auto border-t sm:border-none mt-4 sm:mt-0 pt-4 sm:pt-0">
          {data.status === "pending" && (
            <>
              <ActionButton
                onClick={() => reservationInfoModal.onOpen(data, 2)}
                disabled={disabled}
                icon={AiOutlineCheck}
                tooltip="Approve"
                variant="approve"
                className="w-full sm:w-auto"
              />
              <ActionButton
                onClick={() => reservationInfoModal.onOpen(data, 1)}
                disabled={disabled}
                icon={AiOutlineClose}
                tooltip="Dismiss"
                variant="reject"
                className="w-full sm:w-auto"
              />
            </>
          )}
          {data.status !== "pending" && (
            <ReservationStatusField status={data.status} />
          )}
        </div>
      )}
      {listing.userId !== currentUser?.id && (
        <ReservationStatusField status={data.status} />
      )}
    </div>
  );
};

export default ReservationRow;
