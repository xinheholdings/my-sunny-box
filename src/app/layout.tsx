import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Sunny Box — Brighten Your Everyday Life",
  description:
    "Discover simple, thoughtful products that bring joy and convenience to everyday life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
