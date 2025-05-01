"use client";

import { useEffect, useState } from "react";
import Container from "../components/Container";
import Link from "next/link";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { logEvent } from "../utils/clientLogger";

const VerifiedSuccessClient = ({ currentUser, translation }) => {
  const router = useRouter();
  const params = useSearchParams();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!currentUser?.verified) {
      const token = params?.get("token");
      axios
        .get(`/api/verify-email?token=${token}`)
        .then(() => {
          setVerified(true);
          logEvent({ message: "Successfully verified", level: 'info', userId: currentUser?.id });
        })
        .catch((error) => logEvent({ message: "Error in user verfication", level: 'error', userId: currentUser?.id, error: error }));
    } else {
      router.push("/");
      setVerified(true);
    }
  }, [verified, currentUser?.verified]);

  if (!verified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-orange-500 font-semibold text-lg">
            {translation.verifying || "Verifying..."}
          </p>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default VerifiedSuccessClient;
