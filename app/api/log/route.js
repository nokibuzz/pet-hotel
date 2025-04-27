import { logger } from "@/app/libs/logtail.js";
import { NextResponse } from "next/server";


export async function POST(req) {
  const { message, level = "info", context = {} } = await req.json();
  const userAgent = req.headers["user-agent"];
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {

    await logger.log(level, message, {
      ...context,
      userAgent,
      ip,
    });
    
  } catch (error) {
    throw new Error(error);
  }

  return NextResponse.json({ success: true });
}
