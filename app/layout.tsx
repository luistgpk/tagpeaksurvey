import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tagpeak Decision Survey",
  description:
    "Interactive staircase survey exploring how shoppers trade discounts for Tagpeak experiences."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
