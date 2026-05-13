// import Image from "next/image";

// export default function Navbar() {
//   return (
//     // Maine py-1.5 ko badha kar py-3 kar diya hai height badhane ke liye
//     <div className="bg-blue-700 text-white py-3 px-6 flex items-center gap-4 shadow-lg border-b border-blue-800">
//       <div className="bg-white rounded-full p-1 flex items-center justify-center shadow-sm">
//         <Image
//           src="/GridIndiaLogo.png"
//           alt="Grid India Logo"
//           width={55} // Logo ko thoda sa bada kiya hai balance ke liye
//           height={55}
//           className="rounded-full object-contain"
//         />
//       </div>
      
//       <div className="flex flex-col">
//         <span className="font-bold text-lg tracking-wide leading-tight">
//           Meter Data Collection Portal
//         </span>
//         <span className="text-[10px] text-blue-100 uppercase tracking-tighter opacity-80">
//           Grid Controller of India Limited
//         </span>
//       </div>
//     </div>
//   );
// }

"use client"; // usePathname ke liye zaroori hai

import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavbarProps {
  userName?: string; // Coordinator ya Admin ka naam pass karne ke liye
  rldcName?: string; // Jaise "NRLDC", "WRLDC" etc.
}

export default function Navbar({ userName = "User", rldcName = "NRLDC" }: NavbarProps) {
  const pathname = usePathname();

  // Naam se initials nikalne ka logic
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase();

  // Page ke hisaab se content decide karna
  let displayRole = "";
  let displayIcon = "";

  if (pathname?.includes("/register")) {
    displayRole = "New Registration";
    displayIcon = "?";
  } else if (pathname?.includes("/coordinator")) {
    displayRole = `Coordinator — ${rldcName}`;
    displayIcon = initials;
  } else if (pathname?.includes("/admin")) {
    displayRole = "Admin — Grid India";
    displayIcon = initials;
  } else {
    // Default fallback
    displayRole = "Guest User";
    displayIcon = "U";
  }

  return (
    <div className="bg-blue-700 text-white py-3 px-6 flex items-center justify-between shadow-lg border-b border-blue-800">
      
      {/* Left Side: Logo aur Title */}
      <div className="flex items-center gap-4">
        <div className="bg-white rounded-full p-1 flex items-center justify-center shadow-sm">
          <Image
            src="/GridIndiaLogo.png"
            alt="Grid India Logo"
            width={55}
            height={55}
            className="rounded-full object-contain"
          />
        </div>
        
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-wide leading-tight">
            Meter Data Collection Portal
          </span>
          <span className="text-[10px] text-blue-100 uppercase tracking-tighter opacity-80">
            Grid Controller of India Limited
          </span>
        </div>
      </div>

      {/* Right Side: Dynamic Portion */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <div className="hidden sm:block border border-blue-400/50 rounded-full px-4 py-1.5 bg-blue-800/40">
          <span className="text-[11px] font-semibold text-blue-50 tracking-wider uppercase">
            {displayRole}
          </span>
        </div>

        {/* Dynamic Icon (Circle) */}
        <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center border-2 border-blue-400 shadow-md">
          <span className="text-sm font-bold text-white uppercase">
            {displayIcon}
          </span>
        </div>
      </div>

    </div>
  );
}