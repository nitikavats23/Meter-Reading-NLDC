import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Registration",
  description: "Grid India Registration Form",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-gray-100`}
      >
        {/* 
            Navbar yahan pass kiya hai. 
            Jab aap coordinator login karenge, to 'userName' waha se dynamic aayega. 
            Abhi ke liye default values de di hain.
        */}
        <Navbar userName="Ankit Verma" rldcName="NRLDC" />

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}