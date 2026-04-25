import SectionCard from "@/components/SectionCard";

export default function ApprovalSection() {
  return (
    <SectionCard title="Approval Details">
      <div className="grid md:grid-cols-2 gap-5">
        
        <div>
          <label className="block mb-1 font-medium">Assigned Role</label>
          <select className="w-full border p-3 rounded-lg">
            <option>Select Role</option>
            <option>User</option>
            <option>Coordinator</option>
            <option>Admin</option>
            <option>Approver</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Approver / Recommended By
          </label>
          <select className="w-full border p-3 rounded-lg">
            <option>Select Approver</option>
            <option>Manager</option>
            <option>Senior Manager</option>
            <option>Admin Head</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Approval Status</label>
          <select className="w-full border p-3 rounded-lg">
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Remarks</label>
          <textarea
            className="w-full border p-3 rounded-lg"
            rows={3}
            placeholder="Enter remarks"
          />
        </div>

      </div>
    </SectionCard>
  );
}