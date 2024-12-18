"use client";

import Container from "../components/Container";
import ProfileContent from "../components/profile/ProfileContent";

const ProfileClient = ({ currentUser, reservations, pets, properties }) => {
  return (
    <Container>
      <div className="flex flex-col h-max rounded-lg md:flex-row gap-6">
        <div className="flex-1 p-3">
          <ProfileContent
            currentUser={currentUser}
            reservations={reservations}
            pets={pets}
            properties={properties}
          />
        </div>
      </div>
    </Container>
  );
};

export default ProfileClient;
