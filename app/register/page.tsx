"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

import Credentials from "@/sections/Credentials";
import AccountManager from "@/sections/AccountManager";
import EntityDetails from "@/sections/EntityDetails";
import AssociateManager from "@/sections/AssociateManager";
import QCASection from "@/sections/QCADetails";
import ApprovalSection from "@/sections/ApprovalDetails";
import MeterDetails from "@/components/MeterDetails";

import { FormDataType } from "@/types/form";

/* ✅ Initial State (IMPORTANT) */
const initialFormData: FormDataType = {
  credentials: {
    userType: "",
    username: "",
    password: "",
  },
  accountManager: {},
  entity: {},
  associateManagers: [],
  meters: [],
  qcaDetails: {},
};

export default function RegisterPage() {
  const [formData, setFormData] =
    useState<FormDataType>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /*  SUBMIT  */
  const handleSubmit = async () => {
    try {
      
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text();

          let data;

           try {
          data = JSON.parse(text);
} catch {
  console.error("Server returned HTML:", text);
  alert("Server error — check backend");
  return;
}

      if (!res.ok) {
        throw new Error(data.error || "Failed");
        console.log("checking")
      }

      setSubmitted(true);

    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">

        {/* ✅ Pass typed setter */}
        <Credentials setFormData={setFormData} />
        <AccountManager setFormData={setFormData} />
        <EntityDetails setFormData={setFormData} />
        <AssociateManager setFormData={setFormData} />
        <MeterDetails setFormData={setFormData} />
        <QCASection setFormData={setFormData} />
        <ApprovalSection setFormData={setFormData} />

        {/* ✅ Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || submitted}
          className={`px-8 py-3 rounded-lg text-white ${
            submitted ? "bg-yellow-600" : "bg-blue-700"
          }`}
        >
          {loading
            ? "Submitting..."
            : submitted
            ? "Request Pending"
            : "Submit Registration"}
        </button>

      </main>
    </div>
  );
}