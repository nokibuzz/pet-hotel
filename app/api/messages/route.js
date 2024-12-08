import { NextResponse } from "next/server";
import { pusherServer } from "@/app/libs/pusher";
import { prisma } from "@/app/libs/prismadb";

export async function GET(request) {
  const url = new URL(request.url); 
  const chatId = url.searchParams.get('chatId'); 

  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch messages!" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const body = await request.json();
  const {
    chatId,
    message,
  } = body;

  let result = {};
  try {

    const newMessage = await prisma.message.create({
      data: {
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        chatId: chatId,
      },
    });

    result = await pusherServer.trigger(chatId, "upcoming-message", message);
  } catch (error) {
    throw new Error(error);
  }
  return NextResponse.json(result);
}