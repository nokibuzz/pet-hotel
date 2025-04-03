export const dynamic = "force-dynamic";

import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import { getTranslations } from "../utils/getTranslations";
import Link from "next/link";
import Container from "../components/Container";

const VerifiedSuccess = async () => {
  const currentUser = await getCurrentUser();
  const translation = await getTranslations(
    currentUser?.locale,
    "verifiedEmail"
  );

  return (
    <ClientOnly>
      <Container>
        <div className="flex flex-col items-center justify-center h-max max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 md:flex-row gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-full mb-4 animate-bounce">
              ✅
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {translation.emailVerified || "Email Verified Successfully!"}
            </h1>
            <p className="text-gray-600 mt-2">
              {translation.emailVerifiedMessage ||
                "Thank you for verifying your email. You can now access all features."}
            </p>
            <Link
              href="/"
              className="mt-6 inline-block px-5 py-2 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              {translation.goToHome || "Go to Home"}
            </Link>
          </div>
        </div>
      </Container>
    </ClientOnly>
  );
};

export default VerifiedSuccess;
