export const dynamic = "force-dynamic";

import getCurrentUser from "../actions/getCurrentUser";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import ProfileClient from "./ProfileClient";

const ProfilePage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Login to proceed!" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ProfileClient currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ProfilePage;
