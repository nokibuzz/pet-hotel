"use client";

import ListingAddionalInformation from "@/app/components/listings/ListingAddionalInformation";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { options } from "@/app/components/navbar/BasicFilters";
import React, { useMemo, useState } from "react";
import Reviews from "@/app/components/reviews/Reviews";
import Avatar from "@/app/components/Avatar";
import CustomContainer from "@/app/components/CustomContainer";

const ListingClient = ({
  listing,
  reviews,
  totalReviews,
  currentUser,
  translation,
}) => {
  const [totalPrice, setTotalPrice] = useState(null);

  const category = useMemo(() => {
    return options.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <CustomContainer>
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex flex-col gap-6">
          <ListingHead
            id={listing.id}
            title={listing.title}
            imageSrc={listing.imageSrc}
            addressLabel={listing.addressLabel}
            currentUser={currentUser}
            listing={listing}
            translation={translation.ListingClient}
            verified={listing.verified}
          />
          <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-10 mt-10">
            {/* Left Content */}
            <div className="order-first lg:col-span-3 mb-10 lg:mb-0">
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold flex flex-row items-center gap-2">
                  <Avatar src={listing.user?.image} />
                  <div>
                    {translation.ListingClient.petHouseOwner ||
                      "Pet house owner"}{" "}
                    {listing.user?.name}
                  </div>
                </div>
                <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
                  <div>
                    {translation.ListingClient.petCapacity || "Pet capacity:"}{" "}
                    {listing.totalPlaces}
                  </div>
                </div>
              </div>
              <hr className="my-6" />
              <ListingReservation
                listing={listing}
                totalPrice={totalPrice}
                currentUser={currentUser}
                translation={translation.ListingClient}
              />
              <ListingAddionalInformation
                hasFood={listing.hasFood}
                hasGrooming={listing.hasGrooming}
                hasVet={listing.hasVet}
                addionalInformation={listing.addionalInformation}
                translation={translation.ListingAddionalInformation}
              />
            </div>
            {/* Right Content */}
            <div className="lg:col-span-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto hide-scrollbar">
              <div className="space-y-10">
                <ListingInfo
                  user={listing.user}
                  category={category}
                  description={listing.description}
                  location={listing.location.coordinates}
                  houseRules={{
                    checkInTime: listing.checkInTime,
                    checkOutTime: listing.checkOutTime,
                    hasCancelation: listing.hasCancelation,
                    paymentMethodsCards: listing.paymentMethodsCards,
                    paymentMethodsCash: listing.paymentMethodsCash,
                  }}
                  translation={translation.ListingInfo}
                />
                <hr className="my-2" />
                <Reviews
                  reviews={reviews}
                  totalReviews={totalReviews}
                  currentUser={currentUser}
                  listingUser={listing.userId}
                  translation={translation.Review}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomContainer>
  );
};

export default ListingClient;
