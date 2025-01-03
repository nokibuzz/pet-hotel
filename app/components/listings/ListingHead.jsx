"use client";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import useRentModal from "@/app/hooks/useRentModal";
import ImageGallery from "../gallery/ImageGallery";

const ListingHead = ({
  id,
  imageSrc,
  addressLabel,
  title,
  currentUser,
  listing,
  translation,
}) => {
  const rentModal = useRentModal();

  return (
    <>
      <Heading
        title={title}
        subtitle={addressLabel}
        rightComponent={
          <>
            {currentUser?.id === listing?.userId && (
              <div
                onClick={() =>
                  rentModal.onOpen(translation?.RentModal, listing, true)
                }
                className="flex w-[70%] ml-auto justify-center text-sm font-semibold py-3 px-4 mx-1 outline outline-1 rounded-full hover:bg-neutral-100 text-amber-600 transition cursor-pointer"
              >
                {translation.editListing || "Edit Listing"}
              </div>
            )}
          </>
        }
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <ImageGallery images={imageSrc} />
        {currentUser?.hotelOwner !== true && (
          <div className="absolute top-5 right-5">
            <HeartButton listingId={id} currentUser={currentUser} />
          </div>
        )}
      </div>
    </>
  );
};

export default ListingHead;
