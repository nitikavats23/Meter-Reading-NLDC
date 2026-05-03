/*export default function Navbar() {
  return (
    <div className="bg-blue-700 text-white p-4 font-semibold text-lg">
      Meter Data Collection Portal
    </div>
  );
}*/

import Image from "next/image";

export default function Navbar() {
  return (
    <div className="bg-blue-700 text-white px-6 py-2 flex items-center gap-4 shadow-md">
      <div className="bg-white rounded-full p-1 flex items-center justify-center">
        <Image
          src="/grid.png"
          alt="Grid India Logo"
          width={56}
          height={56}
          className="rounded-full object-contain"
        />
      </div>
      <span className="font-bold text-xl tracking-wide">
        Meter Data Collection Portal
      </span>
    </div>
  );
}