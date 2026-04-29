"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import UserPrivileges from "@/sections/UserPrivileges";
import Credentials from "@/sections/Credentials";
import AccountManager from "@/sections/AccountManager";
import EntityDetails from "@/sections/EntityDetails";
import AssociateManager from "@/sections/AssociateManager";
import QCADetails from "@/sections/QCADetails"; 
import MeterDetails from "@/components/MeterDetails";
import { FormDataType } from "@/types/form";

const initialFormData = {
  userType: "", 
  role: "",
  credentials: { username: "", password: "" },
  accountManager: {},
  entity: { rldc: "" },
  associateManagers: [],
  meters: [],
  qcaDetails: { licenseNumber: "", managedStations: "" },
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<any>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      alert("Registration Successful!");
    } catch (err) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-6xl mx-auto">
        
        {/* Section A: User Privileges */}
        <div id="userprivileges">
          <UserPrivileges formData={formData} setFormData={setFormData} />
        </div>

        {/* Section B: Credentials */}
        <div id="credentials">
          <Credentials setFormData={setFormData} />
        </div>

        {/* Section C: Account Manager */}
        <div id="accountmanager">
          <AccountManager setFormData={setFormData} />
        </div>

        {/* Section D: Entity Details */}
        <div id="entitydetails">
          <EntityDetails formData={formData} setFormData={setFormData} />
        </div>

        {/* Section E: Associate Manager */}
        <div id="associatemanager">
          <AssociateManager setFormData={setFormData} />
        </div>

        {/* Section F: Meter Details */}
        <div id="meterdetails">
          <MeterDetails setFormData={setFormData} />
        </div>

        {/* Section G: QCA Conditional Section */}
        {formData && formData.userType === "QCA" && (
          <div id="qcadetails">
            <QCADetails setFormData={setFormData} />
          </div>
        )}

        {/* Updated Submit Button Section */}
        <div className="pt-8 border-t border-gray-200 flex flex-col items-start">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || submitted}
            className={`px-8 py-2.5 rounded-lg text-white font-bold text-[14px] uppercase tracking-wider transition-all shadow-md ${
              submitted 
                ? "bg-slate-400 cursor-not-allowed" 
                : "bg-blue-700 hover:bg-blue-800 active:scale-95 shadow-blue-200"
            }`}
          >
            {loading ? "Processing..." : submitted ? "Submitted" : "Submit"}
          </button>
          
          <p className="mt-3 text-[11px] text-slate-400 italic font-medium">
            * Please review all sections (A-G) before final submission.
          </p>
        </div>
      </main>
    </div>
  );
}