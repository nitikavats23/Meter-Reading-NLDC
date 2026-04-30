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

  import { useRouter } from "next/navigation";

const initialFormData: FormDataType = {
  userType: "",
  role: "",
  credentials: { username: "", password: "" },
  accountManager: {
    fullName: "",
    designation: "",
    email: "",
    altEmail: "",
    phone: "",
    altPhone: "",
  },
  entity: {
    entityName: "",
    substation: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    rldc: "",
  },
  associateManagers: [],
  meters: [],
  qcaDetails: {
    licenseNumber: "",
    managedStations: "",
  },
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Safe merge setter — prevents child components from wiping sibling fields
  const updateFormData = (partial: Partial<FormDataType>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };


const router = useRouter();

const handleSubmit = async () => {
  if (!formData.userType || !formData.role) {
    alert("Please select User Type and Role in Section A before submitting.");
    return;
  }

  try {
    setLoading(true);

    const body = {
      sectionA: {
        userType: formData.userType,
        role: formData.role,
      },
      sectionB: {
        username: formData.credentials.username,
        password: formData.credentials.password,
      },
      sectionC: formData.accountManager,
      sectionD: formData.entity,
      sectionE: formData.associateManagers,
      sectionF: formData.meters,
      sectionG: formData.qcaDetails,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ API ERROR:", data);
      throw new Error(data.error || "Registration failed");
    }

    console.log("✅ SUCCESS:", data);
    setSubmitted(true);

    // ✅ Redirect coordinator, show message for everyone else
    if (formData.role === "COORDINATOR") {
      router.push("/coordinator");
    } else {
      router.push("/registration-success");
    }

  } catch (err: unknown) {
    console.error(err);
    alert(err instanceof Error ? err.message : "Submission failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 p-8 space-y-8 overflow-y-auto max-w-6xl mx-auto">
        
        <div id="userprivileges">
          <UserPrivileges formData={formData} setFormData={updateFormData} />
        </div>

        <div id="credentials">
          <Credentials setFormData={updateFormData} />
        </div>

        <div id="accountmanager">
          <AccountManager setFormData={updateFormData} />
        </div>

        <div id="entitydetails">
          <EntityDetails formData={formData} setFormData={updateFormData} />
        </div>

        <div id="associatemanager">
          <AssociateManager setFormData={updateFormData} />
        </div>

        <div id="meterdetails">
          <MeterDetails setFormData={updateFormData} />
        </div>

        {formData.userType === "QCA" && (
          <QCADetails formData={formData} setFormData={updateFormData} />
        )}

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