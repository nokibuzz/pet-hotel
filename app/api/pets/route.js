import { NextResponse } from "next/server";

import { prisma } from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();

  const {
    name,
    typeName,
    breed,
    birth,
    friendly,
    vaccinated,
    imageSrc,
    description,
    additionalInfo,
  } = body;

  const pet = await prisma.pet.create({
    data: {
      name,
      typeName,
      breed,
      description,
      birth,
      friendly,
      vaccinated,
      imageSrc,
      description,
      additionalInfo,
      owner: {
        connect: {
          id: currentUser.id,
        },
      },
    },
  });

  return NextResponse.json(pet);
}
