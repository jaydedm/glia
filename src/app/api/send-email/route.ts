import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST (request: Request) {
  try {
    const { email } = await request.json() as { email: string }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Create a transporter using SMTP
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
      text: `New request to join Glia from: ${email}`,
      html: `
        <h2>New Glia Request</h2>
        <p>A new user has requested to join Glia.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Please ensure this is a valid email address.</p>
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
