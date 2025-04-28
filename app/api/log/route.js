import { logger } from "@/app/libs/logtail.js";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { message, level = "info", userId = undefined , error = undefined } = await request.json();

  const userAgent = request.headers["user-agent"];
  const ip = request.headers["x-forwarded-for"] || request.socket?.remoteAddress;

  const errorMessage = error?.message;
  const errorStack = error?.stack;
  const errorName = error?.name;

  try {

    await logger.log(message, level, {
      context: {
        userAgent: userAgent,
        ip: ip,
        userId: userId,
        timestamp: new Date().toISOString(),
      },
      error: {
        name: errorName,
        message: errorMessage,
        stack: errorStack,
      },
    });
    
  } catch (error) {
    console.error('Fatal error for log:', error);
  }

  return NextResponse.json({ success: true });
}
