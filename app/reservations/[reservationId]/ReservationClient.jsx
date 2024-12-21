"use client";

import Container from "@/app/components/Container";
import ListingAddionalInformation from "@/app/components/listings/ListingAddionalInformation";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ReservationInfo from "@/app/components/reservations/ReservationInfo";
import { options } from "@/app/components/navbar/BasicFilters";
import React, { useMemo, useEffect, useState } from "react";
import Conversation from "@/app/components/conversation/Conversation";

const ReservationClient = ({ reservation, currentUser }) => {
  const listing = reservation.listing;
  const initialDateRange = {
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    key: "selection",
  };
  const [otherUser, setOtherUser] = useState(undefined);

  useEffect(() => {
    const id =
      currentUser?.id === reservation.userId
        ? reservation.listing.userId
        : reservation.userId;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/${id}`);
        if (!response.ok) throw new Error("User not found!");
        const user = await response.json();
        setOtherUser(user);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const category = useMemo(() => {
    return options.find((item) => item.label === listing.category);
  }, [listing.category]);

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            id={listing.id}
            title={listing.title}
            imageSrc={listing.imageSrc}
            addressLabel={listing.addressLabel}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-10">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              location={listing.location.coordinates}
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
              <Conversation
                reservationId={reservation.id}
                currentUser={currentUser}
                otherUser={otherUser}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReservationClient;
