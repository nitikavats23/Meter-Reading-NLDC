import Image from "next/image";

export default function Navbar() {
  return (
    <div className="bg-blue-700 text-white py-1.5 px-4 flex items-center gap-3 shadow-md">
      <div className="bg-white rounded-full p-0.5 flex items-center justify-center">
        <Image
          src="/GridIndiaLogo.png"
          alt="Grid India Logo"
          width={50}
          height={50}
          className="rounded-full object-contain"
        />
      </div>
      <span className="font-bold text-base tracking-wide">
        Meter Data Collection Portal
      </span>
    </div>
  );
}