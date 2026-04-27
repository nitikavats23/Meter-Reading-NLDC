"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Credentials from "@/sections/Credentials";
import AccountManager from "@/sections/AccountManager";
import EntityDetails from "@/sections/EntityDetails";
import AssociateManager from "@/sections/AssociateManager";
import QCASection from "@/sections/QCADetails"; // Iska naam dhyan se check karein
import ApprovalSection from "@/sections/ApprovalDetails";
import MeterDetails from "@/components/MeterDetails";
import { FormDataType } from "@/types/form";

const initialFormData: FormDataType = {
  credentials: { userType: "", username: "", password: "" },
  accountManager: {},
  entity: {},
  associateManagers: [],
  meters: [],
  qcaDetails: {},
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
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
    } catch (err) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6">
        
        {/* Step 1: Credentials (User Type Selection) */}
        <Credentials setFormData={setFormData} />

        {/* Step 2: Hamesha dikhne wale sections */}
        <AccountManager setFormData={setFormData} />
        <EntityDetails setFormData={setFormData} />
        <AssociateManager setFormData={setFormData} />
        <MeterDetails setFormData={setFormData} />

        {/* Step 3: QCA Section (Sirf tab dikhega jab QCA select ho) */}
        {formData.credentials.userType === "QCA" && (
          <QCASection setFormData={setFormData} />
        )}

        {/* Step 4: Approval Details */}
        <ApprovalSection setFormData={setFormData} />

        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || submitted}
            className={`px-8 py-3 rounded-lg text-white ${
              submitted ? "bg-yellow-600" : "bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : submitted ? "Request Pending" : "Submit Registration"}
          </button>
        </div>
      </main>
    </div>
  );
}