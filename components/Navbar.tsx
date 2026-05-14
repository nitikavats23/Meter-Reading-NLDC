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

// "use client";

// import Image from "next/image";
// import { usePathname } from "next/navigation";

// interface NavbarProps {
//   userName?: string; // Login ke baad user ka naam yahan pass hoga
//   rldcName?: string; // User jis RLDC se hai (e.g., "SRLDC", "WRLDC")
// }

// export default function Navbar({ userName = "Guest User", rldcName = "N/A" }: NavbarProps) {
//   const pathname = usePathname();

//   // Color constants (Aapke project ke theme ke hisaab se)
//   const navyBlue = "#1E3A8A";
//   const lightBlueBg = "#EFF6FF";

//   // Name se initials nikalne ka logic (e.g., "Nandini Singh" -> "NS")
//   const initials = userName
//     .split(" ")
//     .filter(Boolean)
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   // Page URL ke hisaab se Role decide karna
//   let displayRole = "";
//   let displayIcon = initials || "U";

//   if (pathname?.includes("/register")) {
//     displayRole = "New Registration";
//     displayIcon = "?";
//   } else if (pathname?.includes("/coordinator")) {
//     // Agar coordinator login hai, toh uska specific RLDC dikhayenge
//     displayRole = `Coordinator — ${rldcName}`;
//   } else if (pathname?.includes("/admin")) {
//     displayRole = "Admin — Grid India";
//   } else {
//     displayRole = userName; // Default fallback
//   }

//   return (
//     <div 
//       style={{ backgroundColor: navyBlue }} 
//       className="text-white py-3 px-6 flex items-center justify-between shadow-lg border-b border-white/10"
//     >
      
//       {/* Left Side: Logo aur Title */}
//       <div className="flex items-center gap-4">
//         <div className="bg-white rounded-full p-1 flex items-center justify-center shadow-sm">
//           <Image
//             src="/GridIndiaLogo.png"
//             alt="Grid India Logo"
//             width={55}
//             height={55}
//             className="rounded-full object-contain"
//           />
//         </div>
        
//         <div className="flex flex-col">
//           <span className="font-bold text-lg tracking-wide leading-tight">
//             Meter Data Collection Portal
//           </span>
//           <span className="text-[10px] text-blue-100 uppercase tracking-tighter opacity-80">
//             Grid Controller of India Limited
//           </span>
//         </div>
//       </div>

//       {/* Right Side: Dynamic User Info */}
//       <div className="flex items-center gap-4">
//         {/* Dynamic Role Badge (RLDC wise update hoga) */}
//         <div className="hidden sm:block border border-white/20 rounded-full px-4 py-1.5 bg-black/10">
//           <span className="text-[11px] font-semibold text-blue-50 tracking-wider uppercase">
//             {displayRole}
//           </span>
//         </div>

//         {/* User Icon (Initials circle) */}
//         <div 
//           style={{ backgroundColor: lightBlueBg }} 
//           className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/30 shadow-md"
//         >
//           <span 
//             style={{ color: navyBlue }} 
//             className="text-sm font-bold uppercase"
//           >
//             {displayIcon}
//           </span>
//         </div>
//       </div>

//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  
  // State for Dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for dynamic user data
  const [userData, setUserData] = useState({
    name: "Loading...",
    rldc: "N/A",
    isLoaded: false
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserData({
            name: data.admin?.fullName || "User",
            rldc: data.admin?.rldc || "N/A",
            isLoaded: true
          });
        }
      } catch (err) {
        console.error("Navbar fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  // Logout Function connected to your API
  const handleLogout = async () => {
    try {
      // Aapka logout API route call ho raha hai yahan
      const res = await fetch("/api/auth/logout", { 
        method: "POST" 
      });

      if (res.ok) {
        console.log("Logged out successfully");
        // Cookies clear hone ke baad user ko login page par redirect karein
        window.location.href = "/login"; 
      } else {
        console.error("Logout failed on server side");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navyBlue = "#1E3A8A";
  const lightBlueBg = "#EFF6FF";

  const initials = userData.name !== "Loading..." 
    ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  let displayRole = "";
  if (pathname?.includes("/register")) {
    displayRole = "New Registration";
  } else if (pathname?.includes("/coordinator")) {
    displayRole = `Coordinator — ${userData.rldc}`;
  } else if (pathname?.includes("/admin")) {
    displayRole = "Admin — Grid India";
  } else {
    displayRole = userData.isLoaded ? userData.name : "Please Wait...";
  }

  return (
    <div 
      style={{ backgroundColor: navyBlue }} 
      className="text-white py-3 px-6 flex items-center justify-between shadow-lg border-b border-white/10 relative"
    >
      {/* Left: Logo Section */}
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

      {/* Right: User Profile Section */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block border border-white/20 rounded-full px-4 py-1.5 bg-black/10">
          <span className="text-[11px] font-semibold text-blue-50 tracking-wider uppercase">
            {displayRole}
          </span>
        </div>

        {/* Initials Circle with Dropdown Trigger */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ backgroundColor: lightBlueBg }} 
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/30 shadow-md hover:scale-105 transition-transform active:scale-95"
          >
            <span 
              style={{ color: navyBlue }} 
              className="text-sm font-bold uppercase"
            >
              {initials}
            </span>
          </button>

          {/* Logout Dropdown Menu */}
          {isMenuOpen && (
            <>
              {/* Overlay: clickable area to close dropdown */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsMenuOpen(false)}
              ></div>

              <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-2xl z-20 py-1 border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-[12px] font-bold text-gray-800 truncate">{userData.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{userData.rldc} Region</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}