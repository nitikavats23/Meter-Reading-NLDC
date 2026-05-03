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
import ProgressBar from "@/components/ProgressBar";
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

// ── Overlay Component ──────────────────────────────────────────────────────────
function RegistrationSuccessOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full mx-4 text-center space-y-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-[20px] font-bold text-slate-800">
          Application Submitted!
        </h1>

        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
          Your application has been successfully submitted. Your activation link
          will be sent to your registered email address once approved.
        </p>

        {/* Progress Bar — step 1: awaiting coordinator */}
        <div className="border-t border-slate-100 pt-4">
          <ProgressBar currentStep={1} />
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Please check your inbox and spam folder.
        </p>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const updateFormData = (partial: Partial<FormDataType>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmit = async () => {
    if (!formData.userType || !formData.role) {
      alert("Please select User Type and Role in Section A before submitting.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        sectionA: { userType: formData.userType, role: formData.role },
        sectionB: { username: formData.credentials.username, password: formData.credentials.password },
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

      if (formData.role === "COORDINATOR") {
        router.push("/coordinator");
      } else {
        setShowSuccess(true);
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

        {/* Progress Bar — always visible at top, step 0 while filling */}
        <div className="bg-white rounded-xl shadow-sm px-6 py-4 border border-slate-100">
          <ProgressBar currentStep={0} />
        </div>

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

      {/* Success Overlay with Progress Bar at step 1 */}
      <RegistrationSuccessOverlay
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}