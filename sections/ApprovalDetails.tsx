"use client";

import SectionCard from "@/components/SectionCard";

export default function ApprovalDetails() {
  return (
    <div id="approvaldetails">
    <SectionCard title="Section G - Approval Details">
      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-1">
            Assigned Role
          </label>

          <select className="w-full border p-3 rounded">
            <option value="">
              Select Role
            </option>
            <option>User</option>
            <option>Coordinator</option>
            <option>Admin</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Approver
          </label>

          <select className="w-full border p-3 rounded">
            <option value="">
              Select Approver
            </option>
            <option>Manager</option>
            <option>Senior Manager</option>
            <option>Admin Head</option>
          </select>
        </div>

      </div>
    </SectionCard>
    </div>
  );
}