import { NextResponse } from "next/server";

import nodemailer from "nodemailer";

export async function POST(request) {
  const body = await request.json();
  const { sender, to, subject, text, html } = body;

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.com",
    port: 465, // Use 587 for TLS
    secure: true, // Use `false` for TLS (port 587)
    auth: {
      user: "info@furlandapp.com",
      pass: process.env.IONOS_EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent: ", info.messageId);
    return NextResponse.json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Email error: ", error);
    return NextResponse.json({ status: 500, error: "Email sending failed!" });
  }
}
