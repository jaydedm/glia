import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Simple in-memory rate limiting
// In production, use a more robust solution like Redis
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 5; // Maximum 5 requests per hour

export async function POST (request: Request) {
  try {
    // Get client IP for rate limiting
    // Using a simpler approach that doesn't rely on headers API
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

    // Check rate limit
    const now = Date.now();
    const rateLimitData = rateLimit.get(ip);

    if (rateLimitData) {
      // If the window has expired, reset the counter
      if (now - rateLimitData.timestamp > RATE_LIMIT_WINDOW) {
        rateLimit.set(ip, { count: 1, timestamp: now });
      } else if (rateLimitData.count >= MAX_REQUESTS) {
        // Rate limit exceeded
        return NextResponse.json(
          { error: "Too many requests from this ip. Please try again later." },
          { status: 429 }
        );
      } else {
        // Increment the counter
        rateLimit.set(ip, {
          count: rateLimitData.count + 1,
          timestamp: rateLimitData.timestamp
        });
      }
    } else {
      // First request from this IP
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    const { email, instagramHandle, reason } = await request.json() as { email: string; instagramHandle: string; reason: string }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT ?? "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER ?? "",
        pass: process.env.SMTP_PASS ?? "",
      },
    })

    // (Optional) Verify the connection configuration
    try {
      await transporter.verify()
      console.log("SMTP server is ready to take messages")
    } catch (verifyError) {
      console.error("SMTP verification error:", verifyError)
      return NextResponse.json(
        { error: "SMTP verification failed" },
        { status: 500 }
      )
    }

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM ?? "noreply@glia.com",
      to: "jayde@jaydemitchell.com",
      subject: "Glia Request",
      text: `New request to join Glia from: ${email}\nInstagram Handle: ${instagramHandle}\nReason: ${reason}`,
      html: `
        <h2>New Glia Request</h2>
        <p>A new user has requested to join Glia.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Instagram Handle:</strong> ${instagramHandle}</p>
        <p><strong>Reason for Joining:</strong></p>
        <p>${reason}</p>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}
