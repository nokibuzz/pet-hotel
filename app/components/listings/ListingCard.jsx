"use client";

import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import HeartButton from "../HeartButton";
import Button from "../Button";
import qs from "query-string";

const ListingCard = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId,
  currentUser,
  currentSearchParams = undefined,
  nextPage = "listing",
}) => {
  const router = useRouter();
  
  const handleCancel = useCallback(
    (e) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  const onSelect = useCallback(async () => {
    let currentQuery = {};

    if (currentSearchParams) {
      currentQuery = JSON.parse(currentSearchParams.value);
    }

    const url = qs.stringifyUrl(
      {
        url: `/${nextPage}/${actionId}`,
        query: currentQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [nextPage, actionId, router, currentSearchParams]);

  return (
    <div onClick={onSelect} className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            alt="Listing"
            src={data.imageSrc}
            className="object-cover h-full w-full group-hover:scale-110 transition"
          />
          <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">{data.title}</div>
        <div className="font-light text-neutral-500">{data.addressLabel}</div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">$ {price}</div>
          {!reservation && <div className="font-light">per night</div>}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
