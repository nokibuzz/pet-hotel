export const dynamic = "force-dynamic";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import ReservationClient from "@/app/reservations/[reservationId]/ReservationClient";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";

const ReservationPage = async ({ params }) => {
  const reservations = await getReservations(params);
  const currentUser = await getCurrentUser();

  if (!reservations.values().next().value) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationClient
        currentUser={currentUser}
        reservation={reservations.values().next().value}
      />
    </ClientOnly>
  );
};

export default ReservationPage;
