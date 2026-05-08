"use client";
import { useState } from "react";

const adminQueue = [
  { id: "REG-2025-00847", name: "Rajesh Kumar Sharma", type: "Station", timeAgo: "2 days ago" },
  { id: "REG-2025-00839", name: "Suresh Meena", type: "Entity", timeAgo: "1 day ago" },
];

const steps = ["Submission", "Coord. Review", "Admin Approval", "Activation"];

export default function AdminApprovalPage() {
  const [selectedId, setSelectedId] = useState("REG-2025-00847");
  const [remarks, setRemarks] = useState("");
  const currentStep: number = 2; // 0-indexed

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── SIDEBAR ── */}
      <aside className="w-64 min-h-screen bg-white border-r border-slate-100 shadow-sm flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-slate-100">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Approval Queue</p>
          <h2 className="text-sm font-bold text-slate-700">Admin Review</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {adminQueue.map((req) => (
            <button
              key={req.id}
              onClick={() => setSelectedId(req.id)}
              className={`w-full text-left px-3 py-3 rounded-lg border transition-all ${
                selectedId === req.id
                  ? "bg-blue-50 border-blue-200"
                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
              }`}
            >
              <p className="text-[10px] font-mono text-slate-400 mb-0.5">{req.id}</p>
              <p className="text-xs font-semibold text-slate-700 mb-1.5">{req.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{req.type}</span>
                <span className="text-[10px] text-slate-400">{req.timeAgo}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 p-8 overflow-y-auto max-w-5xl">
        <div className="space-y-6">

          {/* PROGRESS BAR — matches ProgressBar component style */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6" style={{ paddingTop: "0.75rem", paddingBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {steps.map((label, i) => {
                const isCompleted = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                    {/* Connector line */}
                    {i < steps.length - 1 && (
                      <div style={{
                        position: "absolute", top: 16, left: "50%", width: "100%", height: 2,
                        background: isCompleted ? "#1D4ED8" : "#E2E8F0", zIndex: 0, transition: "background 0.3s",
                      }} />
                    )}
                    {/* Circle */}
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 13, fontWeight: 600, position: "relative", zIndex: 1,
                      border: `2px solid ${isCompleted ? "#1D4ED8" : isActive ? "#1D4ED8" : "#CBD5E1"}`,
                      background: isCompleted ? "#1D4ED8" : isActive ? "#EFF6FF" : "#F8FAFC",
                      color: isCompleted ? "#fff" : isActive ? "#1D4ED8" : "#94A3B8",
                      transition: "all 0.3s",
                      boxShadow: isActive ? "0 0 0 4px #DBEAFE" : "none",
                    }}>
                      {isCompleted ? (
                        <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : i + 1}
                    </div>
                    {/* Label */}
                    <span style={{
                      marginTop: 8, fontSize: 11, fontWeight: isActive ? 700 : 500,
                      color: isCompleted ? "#1D4ED8" : isActive ? "#1E3A5F" : "#94A3B8",
                      textAlign: "center", letterSpacing: "0.03em", textTransform: "uppercase",
                    }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Step description */}
            <div style={{
              marginTop: 16, textAlign: "center", fontSize: 12, fontWeight: 500, color: "#64748B",
              borderTop: "1px solid #F1F5F9", paddingTop: 12, letterSpacing: "0.01em",
            }}>
              {currentStep === 0 && "Step 1 of 4 — Fill in your registration form"}
              {currentStep === 1 && "Step 2 of 4 — Awaiting coordinator review"}
              {currentStep === 2 && "Step 3 of 4 — Awaiting admin approval"}
              {currentStep === 3 && "Step 4 of 4 — Account activation"}
            </div>
          </div>

          {/* MAIN CARD — same shadow/border as RegisterPage section cards */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">

            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Final Approval — RLDC Admin</h3>
                <p className="text-[11px] text-slate-400 italic mt-0.5">Review coordinator-recommended request and grant final approval or reject.</p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">Step 3 of 4</span>
            </div>

            <div className="px-6 py-6 space-y-8">

              {/* REQUEST SUMMARY */}
              <div className="grid grid-cols-2 gap-0 rounded-lg border border-slate-100 overflow-hidden">
                {[
                  { label: "Applicant", value: "Rajesh Kumar Sharma", type: "text" },
                  { label: "Status", value: "Awaiting Approval", type: "badge-orange" },
                  { label: "Assigned Role", value: "Authorized User", type: "badge-blue" },
                  { label: "Coordinator Remarks", value: "Entity documents verified. Role updated.", type: "italic" },
                ].map((cell, i) => (
                  <div
                    key={i}
                    className={`px-4 py-3 bg-slate-50 ${i < 2 ? "border-b border-slate-100" : ""} ${i % 2 === 0 ? "border-r border-slate-100" : ""}`}
                  >
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">{cell.label}</p>
                    {cell.type === "text" && (
                      <p className="text-xs font-semibold text-slate-700">{cell.value}</p>
                    )}
                    {cell.type === "badge-orange" && (
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold">{cell.value}</span>
                    )}
                    {cell.type === "badge-blue" && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">{cell.value}</span>
                    )}
                    {cell.type === "italic" && (
                      <p className="text-xs text-slate-500 italic">{cell.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* TRIGGER SECTION */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">On Approval — System Will Trigger Both Simultaneously</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 text-lg">📧</span>
                      <h5 className="text-sm font-bold text-blue-900">Activation Email</h5>
                    </div>
                    <p className="text-[11px] text-blue-700 font-semibold mb-2">To: rk.sharma@ntpc.gov.in</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      A <span className="font-bold text-slate-600">secure, time-bound activation link</span> (valid 48 hrs) will be sent.
                    </p>
                  </div>
                  {/* OTP */}
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 text-lg">📱</span>
                      <h5 className="text-sm font-bold text-green-900">OTP to Primary Contact</h5>
                    </div>
                    <p className="text-[11px] text-green-700 font-semibold mb-2">To: +91 98765 43210</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      A <span className="font-bold text-slate-600">6-digit OTP</span> will be sent to the registered mobile number.
                    </p>
                  </div>
                </div>
              </div>

              {/* ADMIN REMARKS + ACTIONS */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Admin Remarks{" "}
                    <span className="normal-case tracking-normal font-normal text-slate-400">(required if rejecting)</span>
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter admin remarks..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-700 placeholder:text-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <button className="px-6 py-2.5 border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition text-sm">
                    Reject Request
                  </button>
                  <button className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 active:scale-95 text-white font-bold rounded-lg transition-all text-sm shadow-md shadow-blue-200 flex items-center gap-2 uppercase tracking-wider">
                    Grant Final Approval ↗
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}