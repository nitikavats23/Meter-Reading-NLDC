"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center">
      
      <Link href="/register">
        <Image
          src="/grid-img.jpg"   // ✅ your actual file name
          alt="Grid India Logo"
          width={40}
          height={40}
          className="cursor-pointer"
        />
      </Link>

    </nav>
  );
}