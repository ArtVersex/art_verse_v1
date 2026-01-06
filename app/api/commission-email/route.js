import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      artistName,
      name,
      email,
      subject,
      budget,
      message
    } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Aartverse Commissions" <contact@aartverse.com>`,
      to: "contact@aartverse.com",
      replyTo: email, // 👈 reply goes to customer
      subject: `Commission Request for ${artistName}`,
      text: `
Artist: ${artistName}

Customer Name: ${name}
Customer Email: ${email}
Budget: ${budget || "Not specified"}

Message:
${message}
      `,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px">
          <h2>New Commission Request</h2>

          <p><strong>Artist:</strong> ${artistName}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Budget:</strong> ${budget || "Not specified"}</p>

          <h3>Vision</h3>
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
    console.error("Commission email error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
