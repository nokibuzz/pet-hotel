"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { FaTools } from "react-icons/fa";

const Logo = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showTooltip, setShowTooltip] = useState(false);

  const url = qs.stringifyUrl(
    {
      url: `/`,
      query: {
        startDate: searchParams?.get("startDate"),
        endDate: searchParams?.get("endDate"),
        // locationValue: searchParams?.get("locationValue"),
        guestCount: searchParams?.get("guestCount"),
      },
    },
    { skipNull: true }
  );

  return (
    <div className="relative flex items-center">
      <Image
        onClick={() => router.push(url)}
        alt="Logo"
        className="md:block cursor-pointer"
        height="30"
        width="30"
        src="/images/logo.png"
      />

      <div
        className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        BETA
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 bg-gray-800 text-white text-xs p-2 rounded-md shadow-md flex items-center gap-2">
          Still in development <FaTools />
        </div>
      )}
    </div>
  );
};

export default Logo;
