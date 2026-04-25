import Sidebar from "@/components/Sidebar";

import Credentials from "@/sections/Credentials";
import AccountManager from "@/sections/AccountManager";
import EntityDetails from "@/sections/EntityDetails";
import AssociateManager from "@/sections/AssociateManager";
import QCASection from "@/sections/QCADetails";
import ApprovalSection from "@/sections/ApprovalDetails";
import MeterDetails from "@/components/MeterDetails";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <Credentials />
        <AccountManager />
        <EntityDetails />
        <AssociateManager />
        <MeterDetails />
        <QCASection />
        <ApprovalSection />

        <button className="bg-blue-700 text-white px-8 py-3 rounded-lg">
          Submit Registration
        </button>
      </main>

    </div>
  );
}