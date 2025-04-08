import "~/app/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Inter } from 'next/font/google';
import { Crimson_Pro } from 'next/font/google';

import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({ subsets: ['latin'] });
const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-crimson-pro',
});

export const metadata: Metadata = {
  title: "Glia",
  description: "Glia Book Club",
  icons: [{ rel: "icon", url: "/GliaBookClubLogo.ico" }],
  openGraph: {
    title: "Glia",
    description: "A discerning collective that cultivates humanity through connection, reflection, and exceptional literature",
    images: [
      {
        url: "/GliaBookClubLogo.png",
        width: 1200,
        height: 630,
        alt: "Glia Book Club",
      },
    ],
    type: "website",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${inter.className} ${crimsonPro.variable}`}>
      <head>
        <link
          rel="preload"
          href="/book-cover-art/nightingale.jpg"
          as="image"
          type="image/jpeg"
        />
      </head>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
