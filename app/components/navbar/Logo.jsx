"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

const Logo = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const url = qs.stringifyUrl(
    {
      url: `/`,
      query: {
        startDate: searchParams?.get('startDate'),
        endDate: searchParams?.get('endDate'),
        locationValue: searchParams?.get('locationValue'),
        guestCount: searchParams?.get('guestCount')
      }
    },
    { skipNull: true }
  );

  return (
    <Image
      onClick={() => router.push(url)}
      alt="Logo"
      className="md:block cursor-pointer"
      height="30"
      width="30"
      src="/images/logo.png"
    />
  );
};

export default Logo;
