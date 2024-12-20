import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import ClientOnly from "./components/ClientOnly";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import PetModal from "./components/modals/PetModal";
import SearchModal from "./components/modals/SearchModal";
import ReviewModal from "./components/modals/ReviewModal";
import ChangePasswordModal from "./components/modals/ChangePasswordModal";
import UploadImageModal from "./components/modals/UploadImageModal";

const font = Nunito({
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "Pet Hotel",
  description: "Pet Hotel manager",
};

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <RentModal currentUser={currentUser} />
          <SearchModal currentUser={currentUser} />
          <PetModal />
          <ReviewModal currentUser={currentUser} />
          <ChangePasswordModal />
          <UploadImageModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
