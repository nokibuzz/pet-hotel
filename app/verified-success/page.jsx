export const dynamic = "force-dynamic";

import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import { getTranslations } from "../utils/getTranslations";
import VerifiedSuccessClient from "./VerifiedSuccessClient";

const VerifiedSuccess = async () => {
  const currentUser = await getCurrentUser();
  const translation = await getTranslations(
    currentUser?.locale,
    "verifiedEmail"
  );

  return (
    <ClientOnly>
      <VerifiedSuccessClient
        currentUser={currentUser}
        translation={translation}
      />
    </ClientOnly>
  );
};

export default VerifiedSuccess;
