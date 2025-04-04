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
import AdvancedFiltersModal from "./components/modals/AdvancedFiltersModal";
import ReviewModal from "./components/modals/ReviewModal";
import ChangePasswordModal from "./components/modals/ChangePasswordModal";
import UploadImageModal from "./components/modals/UploadImageModal";
import { getTranslations } from "./utils/getTranslations";
import ReservationModal from "./components/modals/ReservationModal";
import ReservationInfoModal from "./components/modals/ReservationInfoModal";
import SetNonWorkingDaysModal from "./components/modals/SetNonWorkingDaysModal";
import { GlobalProvider } from "./hooks/GlobalContext";

const font = Nunito({
  subsets: ["latin", "cyrillic"],
});

export const metadata = {
  title: "FurLand",
  description: "Sigurno mesto za tvog ljubimca",
};

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();

  const translation = await getTranslations(currentUser?.locale, "common");
  const reservationTranslation = await getTranslations(
    currentUser?.locale,
    "reservationModal"
  );
  const reservationInfoTranslation = await getTranslations(
    currentUser?.locale,
    "reservationInfoModal"
  );

  return (
    <html lang="en">
      <body className={font.className}>
        <GlobalProvider>
          <ClientOnly>
            <ToasterProvider />
            <LoginModal />
            <RegisterModal />
            <ReservationModal translation={reservationTranslation} />
            <ReservationInfoModal
              currentUser={currentUser}
              translation={reservationInfoTranslation}
            />
            <RentModal currentUser={currentUser} />
            <SetNonWorkingDaysModal currentUser={currentUser} />
            <SearchModal currentUser={currentUser} />
            <AdvancedFiltersModal currentUser={currentUser} />
            <PetModal />
            <ReviewModal currentUser={currentUser} />
            <ChangePasswordModal />
            <UploadImageModal />
            <Navbar currentUser={currentUser} translation={translation} />
          </ClientOnly>
          <div className="pb-20 pt-28">{children}</div>
        </GlobalProvider>
      </body>
    </html>
  );
}
