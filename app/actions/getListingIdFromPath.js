"use client";

import { usePathname } from "next/navigation";

const extractListingId = (pathname) => {
  const match = pathname.match(/\/listing\/([^/?]*)/);

  if (match && match[1]) {
    const listingId = match[1];
    return listingId;
  }

  return null;
};

export function useListingIdByPath() {
  const pathname = usePathname();
  return extractListingId(pathname);
}

export default useListingIdByPath;
