import { NextResponse } from "next/server";

import nodemailer from "nodemailer";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { sender, to, subject, text } = body;

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.com",
    port: 465, // Use 587 for TLS
    secure: true, // Use `false` for TLS (port 587)
    auth: {
      user: "info@furlandapp.com",
      pass: process.env.IONOS_EMAIL_PASSWORD, // Store this in .env file
    },
  });

  try {
    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      text,
    });

    console.log("Email sent: ", info.messageId);
    return NextResponse.status(200).json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Email error: ", error);
    return NextResponse.status(500).json({ error: "Email sending failed!" });
  }
}
