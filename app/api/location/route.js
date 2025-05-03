import { NextResponse } from "next/server";
import { logError } from "@/app/libs/logtail.js";
import { prisma } from "@/app/libs/prismadb";


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
    await logError(req, userId, error);
  }
  
  return NextResponse.json(result);
}