import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import LayoutContent from "./layout-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CircleHub JnU - University Lost & Found Platform",
  description:
    "Modern platform for JnU students to post and find lost items, share items with fellow students, and connect within the campus community.",
  keywords: [
    "university",
    "lost and found",
    "campus",
    "students",
    "share",
    "connect",
    "JnU",
    "Jagannath University",
    "CircleHub",
  ],
  authors: [{ name: "CircleHub JnU Team" }],
  creator: "CircleHub JnU",
  publisher: "CircleHub JnU",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "CircleHub JnU - University Lost & Found Platform",
    description:
      "Find what you've lost, share what you don't need, connect with your JnU campus community.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CircleHub JnU - University Lost & Found Platform",
    description:
      "Find what you've lost, share what you don't need, connect with your JnU campus community.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
