"use client";

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ReservationsClient = ({ reservations, currentUser, translation }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations?reservationId=${id}`)
        .then(() => {
          toast.success(
            translation.ReservationsClient.reservationCanceled ||
              "Reservation cancelled!"
          );
          router.refresh();
        })
        .catch(() => {
          toast.error(
            translation.ReservationsClient.errorOnCancelation ||
              "Something went wrong!"
          );
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  const subtitle = currentUser.hotelOwner
    ? translation.ReservationsClient.subtitleHotelOwner ||
      "Bookings on your place"
    : translation.ReservationsClient.subtitleUser || "Your pet care experience";

  return (
    <Container>
      <Heading
        title={translation.ReservationsClient.title || "Reservations"}
        subtitle={subtitle}
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel={
              translation.ListingCard.cancelReservation || "Cancel reservation"
            }
            currentUser={currentUser}
            nextPage="reservations"
          />
        ))}
      </div>
    </Container>
  );
};

export default ReservationsClient;
