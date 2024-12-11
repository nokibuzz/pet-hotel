import { NextResponse } from "next/server";

export async function POST(req) {
  const { userId, latitude, longitude } = await req.json();

  let result = {};

  try {

    result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            defaultLocation: {
                latitude: latitude,
                longitude: longitude
            }
        },
    });

  } catch (error) {
    throw new Error(error);
  }
  
  return NextResponse.json(result);
}