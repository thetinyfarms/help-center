import type { Metadata } from "next";
import { Space_Grotesk, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

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
    default: "tiny - Help Center",
    template: "%s | tiny - Help Center",
  },
  description: "Guides, firmware updates, and support for your Tinyfarm device",
  icons: {
    icon: "/favicon.svg",
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
        className={`${spaceGrotesk.variable} ${schibstedGrotesk.variable} antialiased bg-background bg-dotted`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
