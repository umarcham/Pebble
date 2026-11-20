import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pebble — kids' clothes, made slow",
  description: "Knits, cord and cotton for newborn to six.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
