import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flash Firmware",
};

export default function FlashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
