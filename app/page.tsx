import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Welcome to Home Page</h1>

      {/* Register Button */}
      <Link href="/register/basic">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Register
        </button>
      </Link>
    </div>
  );
}