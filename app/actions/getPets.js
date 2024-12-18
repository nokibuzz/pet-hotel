import { prisma } from "@/app/libs/prismadb";

export default async function getPets(params) {
  try {
    const { userId } = await params;

    const query = {};

    if (userId) {
      query.userId = userId;
    }

    const pets = await prisma.pet.findMany({ where: query });

    return pets;
  } catch (error) {
    throw new Error(error);
  }
}
