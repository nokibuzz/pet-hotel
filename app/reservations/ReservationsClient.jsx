"use client";

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ReservationGroupInfo from "../components/reservations/ReservationGroupInfo";

const ReservationsClient = ({ reservations, currentUser, translation }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id) => {
      if (
        !reservations.find((reservation) => reservation.id === id).type.listing
          .hasCancelation
      ) {
        return;
      }

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
      <ReservationGroupInfo
        reservations={reservations}
        translation={translation}
        currentUser={currentUser}
      />
    </Container>
  );
};

export default ReservationsClient;
