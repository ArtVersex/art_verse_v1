import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, // port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Aartverse Contact" <contact@aartverse.com>`,
      to: "contact@aartverse.com", // artist / admin
      replyTo: email,              // 👈 reply goes to customer
      subject: `New Contact Request from ${name}`,
      text: `
New contact request received.

Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px">
          <h2>New Contact Request</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>

          <h3>Message</h3>
          <p>${message.replace(/\n/g, "<br/>")}</p>

          <hr/>
          <p style="font-size:12px;color:#666">
            Replying to this email will respond directly to the customer.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
