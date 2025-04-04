export const dynamic = "force-dynamic";

import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import { getTranslations } from "../utils/getTranslations";
import VerifiedSuccessClient from "./VerifiedSuccessClient";

const VerifiedSuccess = async ({ params }) => {
  const { token } = await params;
  const currentUser = await getCurrentUser();
  const translation = await getTranslations(
    currentUser?.locale,
    "verifiedEmail"
  );

  return (
    <ClientOnly>
      <VerifiedSuccessClient
        currentUser={currentUser}
        token={token}
        translation={translation}
      />
    </ClientOnly>
  );
};

export default VerifiedSuccess;
