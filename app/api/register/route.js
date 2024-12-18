import bcrypt from "bcrypt";
import { prisma } from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request) {
  const body = await request.json();
  const { email, name, password, businessName, hotelOwner } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      businessName,
      hotelOwner,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { oldPassword, password } = body;

  try {
    const oldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      currentUser.hashedPassword
    );

    if (!oldPasswordCorrect) {
      return NextResponse.json(
        { error: "Missed old password! Try again!" },
        { status: 400 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);

      const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          hashedPassword,
        },
      });

      return NextResponse.json(updatedUser);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
