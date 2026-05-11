// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// import Navbar from "@/components/Navbar"; 

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "MDCP",
//   description: "Meter data collection portal",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col">
//         {/* Navbar added here */}
//         <Navbar />

//         {/* Page content */}
//         <main className="flex-1">{children}</main>
//       </body>
//     </html>
//   );
// }

"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import { usePathname } from "next/navigation"; // Path check karne ke liye

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Jin pages par Navbar nahi chahiye unhe yahan add kar dein
  const noNavbarPaths = ["/login", "/register"]; 
  const showNavbar = !noNavbarPaths.includes(pathname);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Sirf tab dikhao jab path login na ho */}
        {showNavbar && <Navbar />}

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}