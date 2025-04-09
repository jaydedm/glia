# Glia - Join Request Application

## Overview

Glia is a web application designed to collect requests from users wishing to the Los Angeles-based book club, Glia. It features a form for users to submit their email, social media handle, and reason for joining. The application then sends these details via email to a designated recipient. It includes basic spam prevention (honeypot) and server-side rate limiting.

## Architecture

Glia is built with the T3 Stack:

*   **Framework:** [Next.js](https://nextjs.org/) (React)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Backend:** Next.js API Routes
*   **Email:** [Nodemailer](https://nodemailer.com/) (via SMTP)
*   **Rate Limiting:** In-memory store (IP-based)

### Key Components

1.  **`src/app/_components/EmailForm.tsx` (Frontend):**
    *   Renders the submission form.
    *   Handles client-side state, validation, and honeypot spam prevention.
    *   Submits data to `/api/send-email`.
    *   Displays feedback messages.

2.  **`src/app/api/send-email/route.ts` (Backend):**
    *   Handles `POST` requests from the form.
    *   Implements IP-based rate limiting (max 5 requests/hour per IP).
    *   Validates email format.
    *   Uses `nodemailer` and SMTP credentials (from environment variables) to send the request email.
    *   Returns JSON responses.

## Deployment

This application is deployed on [Vercel](https://vercel.com/).

**Environment Variables Required on Vercel:**

*   `SMTP_HOST`: Your SMTP server host.
*   `SMTP_PORT`: Your SMTP server port.
*   `SMTP_SECURE`: Use TLS (`true`/`false`).
*   `SMTP_USER`: Your SMTP username.
*   `SMTP_PASS`: Your SMTP password.
*   `SMTP_FROM`: The "from" email address for sent emails.

There are some other required variables to support authentication and persistent storage, but the admin features those require are pending. Authentication is ready to go, powered by NextAuth.

## Development Setup

1.  Clone the repository.
2.  Install dependencies (`npm install`, `yarn install`, or `pnpm install`).
3.  Create a `.env.local` file with the SMTP environment variables listed above.
4.  Run the development server (`npm run dev`, `yarn dev`, or `pnpm dev`).
