import type { Metadata } from "next";
import { Space_Grotesk, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading-family",
  subsets: ["latin"],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-body-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tinyfarm Help Center",
    template: "%s | Tinyfarm Help Center",
  },
  description: "Guides, firmware updates, and support for your Tinyfarm device",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${schibstedGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
