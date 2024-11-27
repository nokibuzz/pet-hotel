"use client";

// import { useRouter } from "next/navigation";
import Container from "../components/Container";
import { useState } from "react";
import { ProfileTabs } from "../types/ProfileTabs";
import TabContent from "../components/TabContent";

const ProfileClient = ({ currentUser }) => {
  //   const router = useRouter();

  const [activeTab, setActiveTab] = useState(ProfileTabs.ACCOUNTS);

  return (
    <Container>
      <div className="flex flex-col min-h-screen rounded-lg md:flex-row gap-6">
        <div className="flex-1 p-3">
          <TabContent activeTab={activeTab} currentUser={currentUser} />
        </div>
      </div>
    </Container>
  );
};

export default ProfileClient;
