"use client";
import { useState } from "react";
import RequestSidebar from "@/components/RequestSidebar";
import ProgressBar from "@/components/ProgressBar";
import SectionCard from "@/components/SectionCard";

// Admin ke liye list (Jo coordinator se approve ho kar aayi hain)
const adminQueue = [
  { id: "REG-2025-00847", name: "Rajesh Kumar Sharma", type: "Station", timeAgo: "2 days ago", status: "Awaiting approval" },
  { id: "REG-2025-00839", name: "Suresh Meena", type: "Entity", timeAgo: "1 day ago", status: "Awaiting approval" },
];

export default function AdminApprovalPage() {
  const [selectedId, setSelectedId] = useState("REG-2025-00847");

  return (
    <div className="flex h-full w-full">
      {/* 1. Middle Column: Admin's Pending List */}
      <RequestSidebar 
        title="Admin Approval Queue" 
        requests={adminQueue} 
        selectedId={selectedId} 
        onSelect={(id) => setSelectedId(id)} 
      />

      {/* 2. Main Content: Final Decision Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <ProgressBar currentStep={2} /> {/* Admin step 3 of 4 */}
          </div>

          <SectionCard title={`Final Approval — RLDC Admin`}>
            <p className="text-xs text-slate-500 mb-6 italic">Review coordinator-recommended request and grant final approval or reject.</p>
             
            {/* Request Summary (Image ke table jaisa) */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8">
               <div className="flex justify-between border-b border-slate-200 pb-2">
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Applicant</span>
                 <span className="text-sm font-semibold">Rajesh Kumar Sharma</span>
               </div>
               <div className="flex justify-between border-b border-slate-200 pb-2">
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Status</span>
                 <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold">Awaiting approval</span>
               </div>
               <div className="flex justify-between border-b border-slate-200 pb-2">
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned role</span>
                 <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">Authorized user</span>
               </div>
               <div className="flex justify-between border-b border-slate-200 pb-2">
                 <span className="text-[10px] text-slate-400 font-bold uppercase">Coord. remarks</span>
                 <span className="text-xs text-slate-600 italic">Entity documents verified. Role updated.</span>
               </div>
            </div>

            {/* Trigger Info (Blue & Green Cards from Image) */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-tight">On approval — system will trigger both simultaneously</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Activation Email Card */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 text-lg">📧</span>
                    <h5 className="text-sm font-bold text-blue-900">Activation email</h5>
                  </div>
                  <p className="text-[11px] text-blue-700 font-medium">To: rk.sharma@ntpc.gov.in</p>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    A <span className="font-bold">secure, time-bound activation link</span> (valid 48 hrs) will be sent.
                  </p>
                </div>

                {/* OTP Card */}
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 text-lg">📱</span>
                    <h5 className="text-sm font-bold text-green-900">OTP to primary contact</h5>
                  </div>
                  <p className="text-[11px] text-green-700 font-medium">To: +91 98765 43210</p>
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    A <span className="font-bold">6-digit OTP</span> will be sent to the registered mobile.
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Decision Actions */}
            <div className="pt-6 border-t space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Admin remarks <span className="text-slate-400 lowercase font-normal">(required if rejecting)</span></label>
                <textarea 
                  placeholder="Enter admin remarks..." 
                  className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button className="px-8 py-2.5 border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition text-sm">
                  Reject request
                </button>
                <button className="px-8 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition text-sm shadow-lg flex items-center gap-2">
                  Grant final approval ↗
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}