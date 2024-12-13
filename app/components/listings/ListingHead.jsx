"use client";

import Heading from "../Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";
import useRentModal from "@/app/hooks/useRentModal";

const ListingHead = ({
  id,
  imageSrc,
  locationValue,
  title,
  currentUser,
  listing,
}) => {
  const rentModal = useRentModal();

  return (
    <>
      <Heading
        title={title}
        subtitle={locationValue}
        rightComponent={
          <div
            onClick={() => rentModal.onOpen(listing)}
            className="flex w-[70%] ml-auto justify-center text-sm font-semibold py-3 px-4 mx-1 outline outline-1 rounded-full hover:bg-neutral-100 text-amber-600 transition cursor-pointer"
          >
            Edit Listing
          </div>
        }
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          alt="Picture"
          src={imageSrc}
          fill
          className="object-cover w-full"
        />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
