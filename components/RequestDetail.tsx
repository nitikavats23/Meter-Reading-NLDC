// components/RequestDetail.tsx
"use client";

export default function RequestDetail() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-4 border-b bg-slate-50/50">
        <h3 className="font-bold text-sm text-slate-700">Request detail — REG-2025-00847</h3>
      </div>

      <div className="p-6">
        {/* Info Table */}
        <table className="w-full text-sm text-left border-collapse">
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 text-slate-500 font-medium w-1/3">User type</td>
              <td className="py-3">
                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                  Station
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-3 text-slate-500 font-medium">Full name</td>
              <td className="py-3 text-slate-700 font-semibold">Rajesh Kumar Sharma</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-500 font-medium">Primary email</td>
              <td className="py-3 text-blue-600 italic hover:underline cursor-pointer">
                rk.sharma@ntpc.gov.in
              </td>
            </tr>
            <tr>
              <td className="py-3 text-slate-500 font-medium">Contact no.</td>
              <td className="py-3 text-slate-700 font-semibold">+91 98765 43210</td>
            </tr>
            <tr>
              <td className="py-3 text-slate-500 font-medium">Entity</td>
              <td className="py-3 text-slate-700 leading-relaxed font-medium">
                NTPC Vindhyachal — Substation SS-01
              </td>
            </tr>
            <tr>
              <td className="py-3 text-slate-500 font-medium">Meters</td>
              <td className="py-3 text-slate-700 font-medium">
                MTR-001234, MTR-005678 (2 meters)
              </td>
            </tr>
          </tbody>
        </table>

        {/* Form Controls */}
        <div className="mt-8 grid grid-cols-2 gap-6 border-t pt-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Assign role <span className="text-red-500">*</span>
            </label>
            <select className="w-full border border-slate-200 p-2.5 rounded-md text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none">
              <option>User (default)</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Approver / Recommended by <span className="text-red-500">*</span>
            </label>
            <select className="w-full border border-slate-200 p-2.5 rounded-md text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none">
              <option>Smt. A. Verma (Sr. Co...)</option>
              <option>Shri R. Kumar (Admin)</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Coordinator remarks
          </label>
          <textarea 
            className="w-full border border-slate-200 p-3 rounded-md text-sm min-h-[100px] bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" 
            placeholder="Notes for RLDC Admin — visible in the approval dashboard..."
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end border-t pt-6">
          <button className="px-5 py-2.5 text-sm text-red-600 font-bold border border-red-100 rounded-md hover:bg-red-50 transition-colors">
            Return to applicant
          </button>
          <button className="px-5 py-2.5 text-sm bg-[#1e293b] text-white font-bold rounded-md hover:bg-slate-900 transition-all flex items-center gap-2 shadow-sm shadow-slate-200">
            Forward to RLDC Admin 
            <span className="text-xs">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}