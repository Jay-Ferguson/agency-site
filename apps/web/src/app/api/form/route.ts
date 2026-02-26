import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();

  // Configure nodemailer with your email provider's settings
  // Make sure to add these environment variables to your .env.local file
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_TO, // The email address where you want to receive the form submissions
      subject: `New form submission from ${name}`,
      html: `<p>You have a new form submission</p><br>
        <p><strong>Name: </strong> ${name}</p>
        <p><strong>Email: </strong> ${email}</p>
        <p><strong>Message: </strong> ${message}</p>
      `,
    });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: email,
      event: "contact_form_api_submitted",
      properties: {
        name,
        email,
        has_message: typeof message === "string" && message.trim().length > 0,
        source: "api_form",
      },
    });
    await posthog.shutdown();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: email ?? "anonymous",
      event: "contact_form_api_failed",
      properties: {
        error_message: error instanceof Error ? error.message : "Unknown error",
        source: "api_form",
      },
    });
    await posthog.shutdown();

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
