"use client";

import ListingAddionalInformation from "@/app/components/listings/ListingAddionalInformation";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { options } from "@/app/components/navbar/BasicFilters";
import useLoginModal from "@/app/hooks/useLoginModal";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import Reviews from "@/app/components/reviews/Reviews";
import Avatar from "@/app/components/Avatar";
import CustomContainer from "@/app/components/CustomContainer";

const ListingClient = ({
  listing,
  reservations = [],
  reviews,
  totalReviews,
  currentUser,
  translation,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  console.log("lis", JSON.stringify(listing));

  const disabledDates = useMemo(() => {
    let result = new Set();
    let reservedDates = {};

    // 🏨 Track blocked dates
    // blockedDates.forEach((block) => {
    //   const range = eachDayOfInterval({
    //     start: new Date(block.startDate),
    //     end: new Date(block.endDate),
    //   });
    //   range.forEach((date) => result.add(date.toISOString().split("T")[0]));
    // });

    // 🛑 Track reservations and availability
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      range.forEach((date) => {
        const formattedDate = date.toISOString().split("T")[0];

        // Count reservations per type
        reservedDates[formattedDate] = (reservedDates[formattedDate] || 0) + 1;

        // Disable if fully booked
        const typeAvailability = listing.types.find(
          (t) => t.id === reservation.typeId
        );
        if (
          typeAvailability &&
          reservedDates[formattedDate] >= typeAvailability.capacity
        ) {
          result.add(formattedDate);
        }
      });
    });

    return [...result];
  }, [reservations, /*blockDates,*/ listing]);

  const searchParams = useSearchParams();
  const initialDateRange = {
    startDate: searchParams?.get("startDate")
      ? searchParams.get("startDate")
      : new Date(),
    endDate: searchParams?.get("endDate")
      ? searchParams.get("endDate")
      : new Date(),
    key: "selection",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState(initialDateRange);

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id,
      })
      .then(() => {
        toast.success(
          translation.ListingClient.reservationSuccessfull ||
            "Successfully reserved pet stay!"
        );
        setDateRange(initialDateRange);
        router.push("/reservations");
      })
      .catch(() => {
        toast.error(
          translation.ListingClient.reservationError ||
            "Something went wrong on reservation!"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  // useEffect(() => {
  //   if (dateRange.startDate && dateRange.endDate && selectedType) {
  //     const dayCount = differenceInCalendarDays(
  //       dateRange.endDate,
  //       dateRange.startDate
  //     );

  //     if (dayCount > 0) {
  //       let total = 0;

  //       // Iterate over each night
  //       eachDayOfInterval({
  //         start: dateRange.startDate,
  //         end: dateRange.endDate,
  //       }).forEach((date) => {
  //         let price = selectedType.defaultPrice; // Base price
  //         const formattedDate = date.toISOString().split("T")[0];

  //         // Apply special price if available
  //         const special = specialPrices.find(
  //           (sp) =>
  //             formattedDate >= sp.startDate &&
  //             formattedDate <= sp.endDate &&
  //             sp.typeId === selectedType.id
  //         );
  //         if (special) {
  //           price = special.price;
  //         } else {
  //           // Check weekend pricing
  //           const isWeekend = [5, 6].includes(getDay(date)); // 5 = Saturday, 6 = Sunday
  //           if (isWeekend && selectedType.weekendPrice) {
  //             price = selectedType.weekendPrice;
  //           }
  //         }

  //         total += price;
  //       });

  //       setTotalPrice(total);
  //     } else {
  //       setTotalPrice(selectedType.defaultPrice);
  //     }
  //   }
  // }, [dateRange, selectedType, specialPrices]);

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
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
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
