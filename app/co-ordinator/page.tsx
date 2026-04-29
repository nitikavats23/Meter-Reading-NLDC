/*"use client";

import { useEffect, useState } from "react";
import { ApprovalType } from "@/types/coordinator";

export default function CoordinatorPage() {
  const [requests, setRequests] = useState<ApprovalType[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [assignedRole, setAssignedRole] = useState("ADMIN");
  const [remarks, setRemarks] = useState("");

  // ✅ Derived selected (NO extra state)
  const selected =
    requests.find((r) => r.id === selectedId) || requests[0];

  // ✅ Fetch queue (no cascading issue)
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/coordinator/requests");
      const data = await res.json();

      setRequests(data);

      // set default selected only once
      if (data.length > 0) {
        setSelectedId((prev) => prev ?? data[0].id);
      }
    };

    loadData();
  }, []);

  // ✅ Approve / Return
  const handleAction = async (action: "approve" | "return") => {
    if (!selected) return;

    await fetch("/api/coordinator/action", {
      method: "POST",
      body: JSON.stringify({
        userId: selected.user.id,
        action,
        role: assignedRole,
        approverId: "COORDINATOR_ID", // replace with session later
        remarks,
      }),
    });

    // refresh
    const res = await fetch("/api/coordinator/requests");
    const data = await res.json();

    setRequests(data);
    setSelectedId(data[0]?.id || null);
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER /}
      <h1 className="text-2xl font-semibold">
        Registration Review – RLDC Coordinator
      </h1>
      {/* STEPPER /}
      <div className="bg-white border rounded p-4 flex justify-between">
        {["Submitted", "Coordinator", "Admin", "Activation"].map(
          (step, i) => (
            <div key={i} className="text-center flex-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white ${
                  i <= 1 ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                {i + 1}
              </div>
              <p className="text-xs mt-2">{step}</p>
            </div>
          )
        )}
      </div>

      {/* MAIN GRID /}
      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT: QUEUE }
        <div className="border rounded p-4 bg-white">
          <h2 className="font-semibold mb-4">Pending Queue</h2>

          {requests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedId(req.id)}
              className={`p-3 border rounded mb-3 cursor-pointer ${
                selected?.id === req.id
                  ? "bg-blue-50 border-blue-500"
                  : ""
              }`}
            >
              <p className="font-medium">
                {req.user.username}
              </p>
              <p className="text-sm text-gray-500">
                {req.user.profile?.fullName} •{" "}
                {req.user.userType}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: DETAILS /}
        {selected && (
          <div className="border rounded p-4 bg-white space-y-4">
            <h2 className="font-semibold">Details</h2>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500">User Type</p>
              <p>{selected.user.userType}</p>

              <p className="text-gray-500">Full Name</p>
              <p>{selected.user.profile?.fullName}</p>

              <p className="text-gray-500">Email</p>
              <p>{selected.user.profile?.email}</p>

              <p className="text-gray-500">Phone</p>
              <p>{selected.user.profile?.phone}</p>

              <p className="text-gray-500">Entity</p>
              <p>
                {selected.user.entity?.entityName}
              </p>

              <p className="text-gray-500">Meters</p>
              <p>
                {selected.user.meters
                  .map((m) => m.meterNo)
                  .join(", ")}
              </p>
            </div>

            {/* ACTIONS /}
            <div className="grid grid-cols-2 gap-3">
              <select
                className="border p-2 rounded"
                value={assignedRole}
                onChange={(e) =>
                  setAssignedRole(e.target.value)
                }
              >
                <option value="ADMIN">Admin</option>
                <option value="COORDINATOR">
                  Coordinator
                </option>
              </select>

              <input
                className="border p-2 rounded"
                placeholder="Approver ID"
              />
            </div>

            <textarea
              className="w-full border p-2 rounded"
              placeholder="Remarks"
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleAction("approve")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => handleAction("return")}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
*/

"use client";

import { useState } from "react";

type Request = {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  entity: string;
  meters: string[];
};

export default function CoordinatorPage() {
  const [selected, setSelected] = useState<Request | null>({
    id: "REG-2025-00847",
    name: "Rajesh Kumar Sharma",
    type: "Station",
    email: "rk.sharma@ntpc.gov.in",
    phone: "+91 9876543210",
    entity: "NTPC Vindhyachal – SS-01",
    meters: ["MTR-001234", "MTR-005678"],
  });

  const requests: Request[] = [
    selected!,
    {
      id: "REG-2025-00851",
      name: "Anita Singh",
      type: "QCA",
      email: "anita@test.com",
      phone: "+91 9999999999",
      entity: "Test Entity",
      meters: ["MTR-00999"],
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Registration Review – RLDC Coordinator
        </h1>
        <p className="text-gray-500 text-sm">
          Review request, update role if needed, then forward to admin
        </p>
      </div>

      {/* STEPPER */}
      <div className="bg-white border rounded-lg p-5 flex justify-between items-center">
        {["Submitted", "Coordinator Review", "Admin Approval", "Activation"].map(
          (step, i) => (
            <div key={i} className="flex-1 text-center">
              <div
                className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  i <= 1 ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                {i + 1}
              </div>
              <p className="text-xs mt-2">{step}</p>
            </div>
          )
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT: QUEUE */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Pending Queue</h2>

          {requests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelected(req)}
              className={`p-3 border rounded mb-3 cursor-pointer ${
                selected?.id === req.id
                  ? "bg-blue-50 border-blue-500"
                  : ""
              }`}
            >
              <p className="font-medium">{req.id}</p>
              <p className="text-sm text-gray-500">
                {req.name} • {req.type}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: DETAILS */}
        {selected && (
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold">
              Request Detail – {selected.id}
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <p className="text-gray-500">User Type</p>
              <p className="font-medium">{selected.type}</p>

              <p className="text-gray-500">Full Name</p>
              <p>{selected.name}</p>

              <p className="text-gray-500">Email</p>
              <p>{selected.email}</p>

              <p className="text-gray-500">Contact</p>
              <p>{selected.phone}</p>

              <p className="text-gray-500">Entity</p>
              <p>{selected.entity}</p>

              <p className="text-gray-500">Meters</p>
              <p>{selected.meters.join(", ")}</p>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <label className="block text-sm mb-1">
                  Assign Role
                </label>
                <select className="w-full border p-2 rounded">
                  <option>User</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Approver
                </label>
                <select className="w-full border p-2 rounded">
                  <option>Smt. A. Verma</option>
                  <option>R. Singh</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">
                Coordinator Remarks
              </label>
              <textarea
                className="w-full border p-2 rounded"
                placeholder="Write remarks..."
              />
            </div>

            <div className="flex gap-3 pt-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded">
                Approve
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded">
                Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}