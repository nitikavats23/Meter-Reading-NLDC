"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

/* ✅ Props */
type Props = {
  setFormData: React.Dispatch<
    React.SetStateAction<FormDataType>
  >;
};

export default function ApprovalDetails({ setFormData }: Props) {
  const [role, setRole] = useState("");
  const [approver, setApprover] = useState("");

  /* ✅ PUSH TO PARENT */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      roleAssignment: {
        role,
        approverId: approver,
      },
    }));
  }, [role, approver, setFormData]);

  return (
    <div id="approvaldetails">
      <SectionCard title="Section G - Approval Details">
        <div className="grid md:grid-cols-2 gap-5">

          {/* Assigned Role */}
          <div>
            <label className="block mb-1">
              Assigned Role
            </label>

            <select
              className="w-full border p-3 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option>User</option>
              <option>Coordinator</option>
              <option>Admin</option>
            </select>
          </div>

          {/* Approver */}
          <div>
            <label className="block mb-1">
              Approver
            </label>

            <select
              className="w-full border p-3 rounded"
              value={approver}
              onChange={(e) => setApprover(e.target.value)}
            >
              <option value="">Select Approver</option>
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