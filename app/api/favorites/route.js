import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { prisma } from "@/app/libs/prismadb";
import { logError } from "@/app/libs/logtail.js";

export async function POST(request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { listingId } = body;

  if (!currentUser) {
    return NextResponse.error();
  }

  try {

    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid Listing ID");
    }

    const favouriteIds = [...(currentUser.favouriteIds || [])];
    favouriteIds.push(listingId);

    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favouriteIds,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    logError(request, currentUser.id, error);
    return NextResponse.json("Something went wrong!");
  }
}

export async function DELETE(request) {
  const body = await request.json();
  const { listingId } = body;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  try {
    
    if (!listingId || typeof listingId !== "string") {
      throw new Error("Invalid Listing ID");
    }

    let favouriteIds = [...(currentUser.favouriteIds || [])];
    favouriteIds = favouriteIds.filter((id) => id !== listingId);

    const user = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        favouriteIds,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    logError(request, currentUser.id, error);
    return NextResponse.json("Something went wrong!");
  }
}
