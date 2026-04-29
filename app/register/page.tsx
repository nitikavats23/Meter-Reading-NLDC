
/*"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Credentials from "@/sections/Credentials";
import AccountManager from "@/sections/AccountManager";
import EntityDetails from "@/sections/EntityDetails";
import AssociateManager from "@/sections/AssociateManager";
import QCASection from "@/sections/QCADetails";
import ApprovalSection from "@/sections/ApprovalDetails";
import MeterDetails from "@/components/MeterDetails";
import ProgressBar from "@/components/ProgressBar";
import StatusCard from "@/components/StatusCard";
import { FormDataType } from "@/types/form";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const currentStep = submitted ? 1 : 0;

  const handleSubmit = async () => {
  try {
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed");

    // ✅ ROLE-BASED REDIRECT
    if (formData.credentials.userType === "COORDINATOR") {
      router.push("/co-ordinator");
      return;
    }

    // normal users → show success UI
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

      <main className="flex-1 p-6 space-y-4">

        {/* Progress Bar Card /}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: "1rem 1.5rem",
          border: "1px solid #E5E7EB",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
              New user registration
            </p>
            <span style={{
              fontSize: 12,
              background: submitted ? "#D1FAE5" : "#FEF3C7",
              color: submitted ? "#065F46" : "#B45309",
              padding: "2px 10px",
              borderRadius: 20,
              fontWeight: 500,
            }}>
              {submitted ? "Submitted" : "In Progress"}
            </span>
          </div>
          <ProgressBar currentStep={currentStep} />
          {submitted && <StatusCard status="Pending" />}
        </div>

        {/* Form Sections /}
        {!submitted ? (
          <>
            <Credentials setFormData={setFormData} />
            <AccountManager setFormData={setFormData} />
            <EntityDetails setFormData={setFormData} />
            <AssociateManager setFormData={setFormData} />
            <MeterDetails setFormData={setFormData} />

            {formData.credentials.userType === "QCA" && (
              <QCASection setFormData={setFormData} />
            )}

            <ApprovalSection setFormData={setFormData} />

            <div className="pt-2 pb-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition-colors"
              >
                {loading ? "Submitting..." : "Submit Registration"}
              </button>
            </div>
          </>
        ) : (
          /* Success Card /
          <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: "2rem",
            border: "1px solid #E5E7EB",
            textAlign: "center",
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "#D1FAE5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: 20,
              color: "#065F46",
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 8px" }}>
              Registration submitted successfully
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 1.5rem" }}>
              Your request has been sent to the coordinator for review.
              You will be notified once it is approved.
            </p>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "#B45309",
              background: "#FEF3C7",
              padding: "6px 16px",
              borderRadius: 20,
            }}>
              Awaiting coordinator review
            </div>
          </div>
        )}

      </main>
    </div>
  );
}*/

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Credentials from "@/sections/Credentials";
import AccountManager from "@/sections/AccountManager";
import EntityDetails from "@/sections/EntityDetails";
import AssociateManager from "@/sections/AssociateManager";
import QCASection from "@/sections/QCADetails";
import ApprovalSection from "@/sections/ApprovalDetails";
import MeterDetails from "@/components/MeterDetails";
import ProgressBar from "@/components/ProgressBar";
import StatusCard from "@/components/StatusCard";
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
  const [formData, setFormData] =
    useState<FormDataType>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const currentStep = submitted ? 1 : 0;

  // ✅ REDIRECT ONLY AFTER SUCCESSFUL SUBMIT
  useEffect(() => {
    if (
      submitted &&
      formData.credentials.userType === "COORDINATOR"
    ) {
      router.push("/coordinator");
    }
  }, [submitted, formData.credentials.userType, router]);

  const handleSubmit = async () => {
  try {
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json(); // 👈 get actual error

    if (!res.ok) {
      console.error("API ERROR:", data);
      throw new Error(data?.message || "Failed");
    }

    setSubmitted(true);
  } catch (err) {
    console.error(err);
    alert("Submission failed - check console");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 space-y-4">

        {/* Progress Bar */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "1rem 1.5rem",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "#6B7280",
                margin: 0,
              }}
            >
              New user registration
            </p>

            <span
              style={{
                fontSize: 12,
                background: submitted ? "#D1FAE5" : "#FEF3C7",
                color: submitted ? "#065F46" : "#B45309",
                padding: "2px 10px",
                borderRadius: 20,
                fontWeight: 500,
              }}
            >
              {submitted ? "Submitted" : "In Progress"}
            </span>
          </div>

          <ProgressBar currentStep={currentStep} />
          {submitted && <StatusCard status="Pending" />}
        </div>

        {/* FORM */}
        {!submitted ? (
          <>
            <Credentials setFormData={setFormData} />
            <AccountManager setFormData={setFormData} />
            <EntityDetails setFormData={setFormData} />
            <AssociateManager setFormData={setFormData} />
            <MeterDetails setFormData={setFormData} />

            {formData.credentials.userType === "QCA" && (
              <QCASection setFormData={setFormData} />
            )}

            <ApprovalSection setFormData={setFormData} />

            <div className="pt-2 pb-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition-colors"
              >
                {loading
                  ? "Submitting..."
                  : "Submit Registration"}
              </button>
            </div>
          </>
        ) : (
          /* SUCCESS UI */
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "2rem",
              border: "1px solid #E5E7EB",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#D1FAE5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                fontSize: 20,
                color: "#065F46",
              }}
            >
              ✓
            </div>

            <h2
              style={{
                fontSize: 18,
                fontWeight: 500,
                margin: "0 0 8px",
              }}
            >
              Registration submitted successfully
            </h2>

            <p
              style={{
                fontSize: 14,
                color: "#6B7280",
                margin: "0 0 1.5rem",
              }}
            >
              Your request has been sent to the coordinator for
              review. You will be notified once it is approved.
            </p>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#B45309",
                background: "#FEF3C7",
                padding: "6px 16px",
                borderRadius: 20,
              }}
            >
              Awaiting coordinator review
            </div>
          </div>
        )}
      </main>
    </div>
  );
}