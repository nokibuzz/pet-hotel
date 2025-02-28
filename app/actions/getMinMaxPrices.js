import { prisma } from "@/app/libs/prismadb";

export default async function getMinMaxPrices() {
  const dbValues = await prisma.listing.aggregate({
    _min: {
      price: true,
    },
    _max: {
      price: true,
    },
  });

  let result = {
    min: dbValues?._min?.price,
    max: dbValues?._max?.price,
  };

  return result;
}
