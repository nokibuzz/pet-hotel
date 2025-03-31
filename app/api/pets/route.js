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

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    const pets = await prisma.pet.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(pets);
  } catch (error) {
    throw new Error(error);
  }
}
