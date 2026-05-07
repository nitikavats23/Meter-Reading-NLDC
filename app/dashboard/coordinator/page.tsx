"use client";

import { useState, useEffect } from "react";
import RequestSidebar from "@/components/RequestSidebar";
import ProgressBar from "@/components/ProgressBar";
import SectionCard from "@/components/SectionCard";

interface UserProfile {
  fullName: string;
  designation: string;
  email: string;
  altEmail?: string | null;
  phone: string;
  altPhone?: string | null;
}

interface UserRole {
  role: string;
}

interface UserEntity {
  entityName: string;
  substation: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  rldc: string;
}

interface UserMeter {
  id: string;
  meterNo: string;
  meterOwner: string;
}

interface UserQCA {
  licenseNumber: string;
  managedStations?: string | null;
}

interface UserAssociateManager {
  id: string;
  name?: string | null;
  designation?: string | null;
  email?: string | null;
  phone?: string | null;
}

interface RequestUser {
  id: string;
  username: string;
  userType: string;
  createdAt: string;
  profile: UserProfile | null;
  role: UserRole | null;
  entity: UserEntity | null;
  meters: UserMeter[];
  qcaDetails: UserQCA | null;
  associateManagers: UserAssociateManager[];
}

interface PendingRequest {
  id: string;
  userId: string;
  approverId: string | null;
  status: string;
  remarks: string | null;
  createdAt: string;
  user: RequestUser;
}

type ActionState = "idle" | "loading" | "success" | "error";

export default function CoordinatorPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [actionMessage, setActionMessage] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/coordinator/requests");

      if (!response.ok) {
        console.error("Failed to fetch requests");
        return;
      }

      const data = await response.json();

      // API returns { pendingRequests, actionedRequests, counts }
      const pending: PendingRequest[] = data.pendingRequests ?? [];
      setRequests(pending);

      if (pending.length > 0) {
        setSelectedId(pending[0].id);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const load = async () => {
    await fetchRequests();
  };
  load();
}, []);
  const selectedRequest = requests.find((req) => req.id === selectedId);

  const handleForward = async () => {
    if (!selectedRequest) return;
    setActionState("loading");
    setActionMessage("");

    try {
      const response = await fetch("/api/coordinator/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: selectedRequest.userId,
          assignedRole: selectedRequest.user.role?.role ?? "USER",
          remarks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setActionState("error");
        setActionMessage(data.error || "Something went wrong");
        return;
      }

      setActionState("success");
      setActionMessage(data.message || "Forwarded to Admin successfully");
      setRemarks("");

      // Remove from list and select next
      const remaining = requests.filter((r) => r.id !== selectedId);
      setRequests(remaining);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    } catch {
      setActionState("error");
      setActionMessage("Network error. Please try again.");
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setActionState("loading");
    setActionMessage("");

    try {
      const response = await fetch("/api/coordinator/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: selectedRequest.userId,
          remarks: remarks || "Rejected by coordinator",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setActionState("error");
        setActionMessage(data.error || "Something went wrong");
        return;
      }

      setActionState("success");
      setActionMessage(data.message || "Request rejected successfully");
      setRemarks("");

      // Remove from list and select next
      const remaining = requests.filter((r) => r.id !== selectedId);
      setRequests(remaining);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    } catch {
      setActionState("error");
      setActionMessage("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-lg font-semibold text-slate-600">
          Loading Pending Requests...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white">
        <RequestSidebar
          title="Registrations"
          requests={requests.map((r) => ({
            id: r.id,
            name: r.user.profile?.fullName ?? r.user.username,
            type: r.user.userType,
            timeAgo: new Date(r.createdAt).toLocaleDateString("en-IN"),
            status: r.status,
          }))}
          selectedId={selectedId}
          onSelect={(id: string) => {
            setSelectedId(id);
            setActionState("idle");
            setActionMessage("");
            setRemarks("");
          }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {selectedRequest ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-800">
                Request Details:{" "}
                {selectedRequest.user.profile?.fullName ?? selectedRequest.user.username}
              </h1>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {selectedRequest.status}
              </span>
            </div>

            <ProgressBar currentStep={1} />

            {/* Basic Info */}
            <SectionCard title="Basic Information">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">User Type</p>
                  <p className="font-medium text-slate-700">{selectedRequest.user.userType}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Username</p>
                  <p className="font-medium text-slate-700">{selectedRequest.user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Request ID</p>
                  <p className="font-medium text-slate-700">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Received On</p>
                  <p className="font-medium text-slate-700">
                    {new Date(selectedRequest.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Profile Info */}
            {selectedRequest.user.profile && (
              <SectionCard title="Contact Information">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Full Name</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.profile.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Designation</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.profile.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.profile.phone}</p>
                  </div>
                  {selectedRequest.user.profile.altEmail && (
                    <div>
                      <p className="text-sm text-slate-500">Alt Email</p>
                      <p className="font-medium text-slate-700">{selectedRequest.user.profile.altEmail}</p>
                    </div>
                  )}
                  {selectedRequest.user.profile.altPhone && (
                    <div>
                      <p className="text-sm text-slate-500">Alt Phone</p>
                      <p className="font-medium text-slate-700">{selectedRequest.user.profile.altPhone}</p>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Entity Info */}
            {selectedRequest.user.entity && (
              <SectionCard title="Entity Information">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Entity Name</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.entity.entityName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Substation</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.entity.substation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Owner Name</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.entity.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Owner Email</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.entity.ownerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Owner Phone</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.entity.ownerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">RLDC</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.entity.rldc || "—"}</p>
                  </div>
                </div>
              </SectionCard>
            )}

            {/* Meters */}
            {selectedRequest.user.meters.length > 0 && (
              <SectionCard title="Meters">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="pb-2 font-medium">#</th>
                        <th className="pb-2 font-medium">Meter No</th>
                        <th className="pb-2 font-medium">Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.user.meters.map((meter, i) => (
                        <tr key={meter.id} className="border-b last:border-0">
                          <td className="py-2 text-slate-500">{i + 1}</td>
                          <td className="py-2 font-medium text-slate-700">{meter.meterNo}</td>
                          <td className="py-2 text-slate-700">{meter.meterOwner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {/* QCA Details */}
            {selectedRequest.user.qcaDetails && (
              <SectionCard title="QCA Details">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">License Number</p>
                    <p className="font-medium text-slate-700">{selectedRequest.user.qcaDetails.licenseNumber}</p>
                  </div>
                  {selectedRequest.user.qcaDetails.managedStations && (
                    <div>
                      <p className="text-sm text-slate-500">Managed Stations</p>
                      <p className="font-medium text-slate-700">{selectedRequest.user.qcaDetails.managedStations}</p>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Associate Managers */}
            {selectedRequest.user.associateManagers.length > 0 && (
              <SectionCard title="Associate Managers">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Designation</th>
                        <th className="pb-2 font-medium">Email</th>
                        <th className="pb-2 font-medium">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest.user.associateManagers.map((mgr) => (
                        <tr key={mgr.id} className="border-b last:border-0">
                          <td className="py-2 font-medium text-slate-700">{mgr.name ?? "—"}</td>
                          <td className="py-2 text-slate-700">{mgr.designation ?? "—"}</td>
                          <td className="py-2 text-slate-700">{mgr.email ?? "—"}</td>
                          <td className="py-2 text-slate-700">{mgr.phone ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {/* Remarks */}
            <SectionCard title="Remarks">
              <textarea
                className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add remarks (optional)..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </SectionCard>

            {/* Action Message */}
            {actionMessage && (
              <div
                className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  actionState === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {actionMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2 pb-8">
              <button
                onClick={handleForward}
                disabled={actionState === "loading"}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionState === "loading" ? "Processing..." : "Forward to Admin"}
              </button>
              <button
                onClick={handleReject}
                disabled={actionState === "loading"}
                className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionState === "loading" ? "Processing..." : "Reject Request"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 italic">
            {requests.length === 0
              ? "No pending requests at the moment"
              : "Select a request from the sidebar to view details"}
          </div>
        )}
      </main>
    </div>
  );
}
