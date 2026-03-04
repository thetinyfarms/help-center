import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tinyfarm",
};

export default function TinyfarmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
