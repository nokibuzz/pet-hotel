export const dynamic = "force-dynamic";

import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import { getTranslations } from "../utils/getTranslations";
import Link from "next/link";

const VerifiedSuccess = async () => {
  // const currentUser = await getCurrentUser();
  // const translation = await getTranslations(currentUser?.locale, "email");

  return (
    <ClientOnly>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>✅ Email Verified Successfully!</h1>
        <p>Thank you for verifying your email. You can now use all features.</p>
        <div className="w-48 mt-4">
          <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
            Go to Home
          </Link>
        </div>
      </div>
    </ClientOnly>
  );
};

export default VerifiedSuccess;
