"use client";

import useCountries from "@/app/hooks/useCountries";
import Heading from "../Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";

const ListingHead = ({ id, imageSrc, locationValue, title, currentUser }) => {
  const { getByValue } = useCountries();

  return (
    <>
      <Heading title={title} subtitle={locationValue} />
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
