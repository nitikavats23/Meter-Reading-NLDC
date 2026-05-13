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
//   title: "Registration",
//   description: "Grid India Registration Form",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-gray-100`}
//       >
//         {/* 
//             Navbar yahan pass kiya hai. 
//             Jab aap coordinator login karenge, to 'userName' waha se dynamic aayega. 
//             Abhi ke liye default values de di hain.
//         */}
//         <Navbar userName="Ankit Verma" rldcName="NRLDC" />

//         {/* Page Content */}
//         <main className="flex-1">{children}</main>
//       </body>
//     </html>
//   );
// }

"use client"; // Client component banaya taaki pathname check kar sakein

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation"; 
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

// Note: Metadata ko 'use client' ke saath layout mein nahi rakh sakte.
// Isliye title ko seedha <title> tag mein niche daal diya hai.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Agar current page '/login' hai, toh isLoginPage true hoga
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <head>
        <title>Registration | Grid India</title>
        <meta name="description" content="Grid India Registration Form" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased bg-gray-100`}
      >
        {/* 
          YAHAN LOGIC HAI: 
          Agar isLoginPage nahi hai (!isLoginPage), tabhi Navbar dikhao.
        */}
        {!isLoginPage && <Navbar userName="Ankit Verma" rldcName="NRLDC" />}

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}