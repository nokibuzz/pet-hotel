import { prisma } from "@/app/libs/prismadb";

export default async function getPets() {
  try {
    const pets = await prisma.pet.findMany();

    return pets;
  } catch (error) {
    throw new Error(error);
  }
}
