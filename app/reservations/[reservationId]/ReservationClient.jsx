"use client";

import Container from "@/app/components/Container";
import ListingAddionalInformation from "@/app/components/listings/ListingAddionalInformation";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ReservationInfo from "@/app/components/reservations/ReservationInfo";
import { categories } from "@/app/components/navbar/Categories";
import React, { useMemo } from "react";

const ReservationClient = ({ reservation, currentUser }) => {
  const listing = reservation.listing;
  const initialDateRange = {
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    key: "selection",
  };

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            id={listing.id}
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-10">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              latlng={listing.latlng}
              houseRules={{
                checkInTime: listing.checkInTime,
                checkOutTime: listing.checkOutTime,
                hasCancelation: listing.hasCancelation,
                paymentMethodsCards: listing.paymentMethodsCards,
                paymentMethodsCash: listing.paymentMethodsCash,
              }}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ReservationInfo
                reservationId={reservation.id}
                price={listing.price}
                totalPrice={reservation.totalPrice}
                dateRange={initialDateRange}
              />
              <ListingAddionalInformation
                hasFood={listing.hasFood}
                hasGrooming={listing.hasGrooming}
                hasVet={listing.hasVet}
                addionalInformation={listing.addionalInformation}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReservationClient;
