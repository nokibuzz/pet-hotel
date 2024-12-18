"use client";

import Container from "../components/Container";
import TabContent from "../components/TabContent";

const ProfileClient = ({ currentUser, reservations, pets }) => {
  return (
    <Container>
      <div className="flex flex-col h-max rounded-lg md:flex-row gap-6">
        <div className="flex-1 p-3">
          <TabContent
            currentUser={currentUser}
            reservations={reservations}
            pets={pets}
          />
        </div>
      </div>
    </Container>
  );
};

export default ProfileClient;
