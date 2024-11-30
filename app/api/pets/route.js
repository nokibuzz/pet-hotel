import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const { name, breed, age, friendly, vaccinated, imageSrc, description } =
    body;

  const pet = await prisma.pet.create({
    data: {
      name,
      breed,
      age,
      friendly,
      vaccinated,
      imageSrc,
      description,
      owner: {
        connect: {
          id: currentUser.id,
        },
      },
    },
  });

  return NextResponse.json(pet);
}
