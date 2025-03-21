"use client";

import Container from "../components/Container";
import Heading from "../components/Heading";
import ReservationGroupInfo from "../components/reservations/ReservationGroupInfo";

const ReservationsClient = ({ reservations, currentUser, translation }) => {
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
