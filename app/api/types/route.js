import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");

  if (!listingId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {

    const response = await prisma.type.findMany({
        where: {
            listingId: listingId
        },
        select: {
            id: true, name: true
        }
    });

    return NextResponse.json(response);
  } 
  catch (error) {
    return NextResponse.json({ error: "Failed to fetch types for listing:" }, { status: 500 });
  }
}
