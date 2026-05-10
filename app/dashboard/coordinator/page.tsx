
"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  fullName: string;
  designation: string;
  email: string;
  altEmail?: string | null;
  phone: string;
  altPhone?: string | null;
}
interface UserRole { role: string; }
interface UserEntity {
  entityName: string; substation: string;
  ownerName: string; ownerEmail: string; ownerPhone: string; rldc: string;
}
interface UserMeter { id: string; meterNo: string; meterOwner: string; }
interface UserQCA { licenseNumber: string; managedStations?: string | null; }
interface UserAssociateManager {
  id: string; name?: string | null; designation?: string | null;
  email?: string | null; phone?: string | null;
}
interface RequestUser {
  id: string; username: string; userType: string; createdAt: string;
  profile: UserProfile | null; role: UserRole | null; entity: UserEntity | null;
  meters: UserMeter[]; qcaDetails: UserQCA | null;
  associateManagers: UserAssociateManager[];
}
interface PendingRequest {
  id: string; userId: string; approverId: string | null;
  status: string; remarks: string | null; createdAt: string; user: RequestUser;
}
type ActionState = "idle" | "loading" | "success" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
          {title}
        </p>
      </div>
      <div style={{ padding: "18px 20px", fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </div>
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string | undefined | null }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {items.filter(i => i.value).map(({ label, value }) => (
        <div key={label}>
          <p style={{ margin: "0 0 3px", fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{label}</p>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

const STEPS = ["Submission", "Coord. Review", "Admin Approval", "Activation"];

function ProgressBar() {
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "18px 24px 14px" }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {STEPS.map((label, i) => {
          const done = i < 1, active = i === 1;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {i < 3 && (
                <div style={{ position: "absolute", top: 14, left: "50%", width: "100%", height: 2, background: done ? "#0f172a" : "#e2e8f0", zIndex: 0 }} />
              )}
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, position: "relative", zIndex: 1,
                border: `2px solid ${done || active ? "#0f172a" : "#cbd5e1"}`,
                background: done ? "#0f172a" : active ? "#f8fafc" : "#f8fafc",
                color: done ? "#fff" : active ? "#0f172a" : "#94a3b8",
                boxShadow: active ? "0 0 0 4px #e2e8f0" : "none",
                fontFamily: "'DM Mono', monospace",
              }}>
                {done ? <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : i + 1}
              </div>
              <span style={{ marginTop: 7, fontSize: 10, fontWeight: active ? 700 : 500, color: done || active ? "#0f172a" : "#94a3b8", textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" as const, fontFamily: "'DM Sans', sans-serif" }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "#64748b", marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9", fontFamily: "'DM Sans', sans-serif" }}>
        Step 2 of 4 — Pending coordinator review
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CoordinatorPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [actionMessage, setActionMessage] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/coordinator/requests");
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const pending: PendingRequest[] = data.pendingRequests ?? [];
        setRequests(pending);
        if (pending.length > 0) setSelectedId(pending[0].id);
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const selectedRequest = requests.find(r => r.id === selectedId);

  const handleForward = async () => {
    if (!selectedRequest) return;
    setActionState("loading"); setActionMessage("");
    try {
      const res = await fetch("/api/coordinator/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: selectedRequest.userId, assignedRole: selectedRequest.user.role?.role ?? "USER", remarks }),
      });
      const data = await res.json();
      if (!res.ok) { setActionState("error"); setActionMessage(data.error || "Something went wrong"); return; }
      setActionState("success"); setActionMessage(data.message || "Forwarded to Admin successfully");
      setRemarks("");
      const remaining = requests.filter(r => r.id !== selectedId);
      setRequests(remaining); setSelectedId(remaining[0]?.id ?? null);
    } catch { setActionState("error"); setActionMessage("Network error. Please try again."); }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setActionState("loading"); setActionMessage("");
    try {
      const res = await fetch("/api/coordinator/requests", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: selectedRequest.userId, remarks: remarks || "Rejected by coordinator" }),
      });
      const data = await res.json();
      if (!res.ok) { setActionState("error"); setActionMessage(data.error || "Something went wrong"); return; }
      setActionState("success"); setActionMessage(data.message || "Request rejected successfully");
      setRemarks("");
      const remaining = requests.filter(r => r.id !== selectedId);
      setRequests(remaining); setSelectedId(remaining[0]?.id ?? null);
    } catch { setActionState("error"); setActionMessage("Network error. Please try again."); }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#0f172a", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>Loading pending requests…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 288, background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Sidebar header */}
          <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Coordinator Portal</p>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Registrations
              {requests.length > 0 && (
                <span style={{ marginLeft: 8, background: "#0f172a", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, fontFamily: "'DM Mono', monospace", verticalAlign: "middle" }}>
                  {requests.length}
                </span>
              )}
            </h2>
          </div>

          {/* Request list */}
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {requests.length === 0 ? (
              <div style={{ padding: "48px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: "0 0 4px" }}>All caught up</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No pending requests</p>
              </div>
            ) : (
              requests.map(r => {
                const active = selectedId === r.id;
                return (
                  <button key={r.id} onClick={() => { setSelectedId(r.id); setActionState("idle"); setActionMessage(""); setRemarks(""); }}
                    style={{
                      width: "100%", textAlign: "left", padding: "11px 13px", borderRadius: 10, marginBottom: 5, cursor: "pointer",
                      border: `1.5px solid ${active ? "#0f172a" : "#f1f5f9"}`,
                      background: active ? "#0f172a" : "white",
                      transition: "all .15s", fontFamily: "'DM Sans', sans-serif",
                    }}>
                    <p style={{ margin: "0 0 3px", fontSize: 10, fontFamily: "'DM Mono', monospace", color: active ? "#94a3b8" : "#94a3b8" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </p>
                    <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: active ? "white" : "#0f172a", lineHeight: 1.3 }}>
                      {r.user.profile?.fullName ?? r.user.username}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, background: active ? "rgba(255,255,255,0.15)" : "#f1f5f9", color: active ? "white" : "#64748b", padding: "2px 7px", borderRadius: 5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
                        {r.user.userType}
                      </span>
                      <span style={{ fontSize: 10, color: active ? "#94a3b8" : "#94a3b8" }}>{relativeTime(r.createdAt)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            <span style={{ fontSize: 10, color: "#94a3b8" }}>Pending review queue</span>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

            {selectedRequest ? (
              <>
                {/* Page title */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8" }}>RLDC Portal</p>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>
                      {selectedRequest.user.profile?.fullName ?? selectedRequest.user.username}
                    </h1>
                  </div>
                  <span style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a", padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                    {selectedRequest.status}
                  </span>
                </div>

                <ProgressBar />

                {/* Basic Info */}
                <SectionCard title="Basic Information">
                  <InfoGrid items={[
                    { label: "User Type", value: selectedRequest.user.userType },
                    { label: "Username", value: selectedRequest.user.username },
                    { label: "Request ID", value: selectedRequest.id },
                    { label: "Received On", value: new Date(selectedRequest.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                  ]} />
                </SectionCard>

                {/* Profile */}
                {selectedRequest.user.profile && (
                  <SectionCard title="Contact Information">
                    <InfoGrid items={[
                      { label: "Full Name", value: selectedRequest.user.profile.fullName },
                      { label: "Designation", value: selectedRequest.user.profile.designation },
                      { label: "Email", value: selectedRequest.user.profile.email },
                      { label: "Phone", value: selectedRequest.user.profile.phone },
                      { label: "Alt Email", value: selectedRequest.user.profile.altEmail },
                      { label: "Alt Phone", value: selectedRequest.user.profile.altPhone },
                    ]} />
                  </SectionCard>
                )}

                {/* Entity */}
                {selectedRequest.user.entity && (
                  <SectionCard title="Entity Information">
                    <InfoGrid items={[
                      { label: "Entity Name", value: selectedRequest.user.entity.entityName },
                      { label: "Substation", value: selectedRequest.user.entity.substation },
                      { label: "Owner Name", value: selectedRequest.user.entity.ownerName },
                      { label: "Owner Email", value: selectedRequest.user.entity.ownerEmail },
                      { label: "Owner Phone", value: selectedRequest.user.entity.ownerPhone },
                      { label: "RLDC", value: selectedRequest.user.entity.rldc || "—" },
                    ]} />
                  </SectionCard>
                )}

                {/* Meters */}
                {selectedRequest.user.meters.length > 0 && (
                  <SectionCard title="Meters">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          {["#", "Meter No", "Owner"].map(h => (
                            <th key={h} style={{ padding: "8px 0", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" as const }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRequest.user.meters.map((m, i) => (
                          <tr key={m.id} style={{ borderBottom: i < selectedRequest.user.meters.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <td style={{ padding: "11px 0", fontSize: 13, color: "#94a3b8" }}>{i + 1}</td>
                            <td style={{ padding: "11px 0", fontSize: 13, fontWeight: 600, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>{m.meterNo}</td>
                            <td style={{ padding: "11px 0", fontSize: 13, color: "#475569" }}>{m.meterOwner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </SectionCard>
                )}

                {/* QCA */}
                {selectedRequest.user.qcaDetails && (
                  <SectionCard title="QCA Details">
                    <InfoGrid items={[
                      { label: "License Number", value: selectedRequest.user.qcaDetails.licenseNumber },
                      { label: "Managed Stations", value: selectedRequest.user.qcaDetails.managedStations },
                    ]} />
                  </SectionCard>
                )}

                {/* Associate Managers */}
                {selectedRequest.user.associateManagers.length > 0 && (
                  <SectionCard title="Associate Managers">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          {["Name", "Designation", "Email", "Phone"].map(h => (
                            <th key={h} style={{ padding: "8px 0", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" as const }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRequest.user.associateManagers.map((mgr, i) => (
                          <tr key={mgr.id} style={{ borderBottom: i < selectedRequest.user.associateManagers.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <td style={{ padding: "11px 0", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{mgr.name ?? "—"}</td>
                            <td style={{ padding: "11px 0", fontSize: 13, color: "#475569" }}>{mgr.designation ?? "—"}</td>
                            <td style={{ padding: "11px 0", fontSize: 13, color: "#475569" }}>{mgr.email ?? "—"}</td>
                            <td style={{ padding: "11px 0", fontSize: 13, color: "#475569" }}>{mgr.phone ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </SectionCard>
                )}

                {/* Remarks */}
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#64748b", marginBottom: 10 }}>
                    Remarks <span style={{ fontWeight: 400, textTransform: "none" as const, letterSpacing: 0, color: "#94a3b8" }}>(required when rejecting)</span>
                  </label>
                  <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Add remarks or reason for rejection…"
                    rows={3}
                    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#0f172a", background: "#f8fafc", outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "none", lineHeight: 1.6, boxSizing: "border-box" as const }}
                  />
                </div>

                {/* Action banner */}
                {actionMessage && (
                  <div style={{ background: actionState === "success" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${actionState === "success" ? "#86efac" : "#fca5a5"}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, fontWeight: 600, color: actionState === "success" ? "#15803d" : "#dc2626", display: "flex", alignItems: "center", gap: 8 }}>
                    {actionState === "success"
                      ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" /></svg>}
                    {actionMessage}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
                  <button
                    onClick={handleForward}
                    disabled={actionState === "loading"}
                    style={{ flex: 1, padding: "11px 0", background: actionState === "loading" ? "#475569" : "#0f172a", border: "none", borderRadius: 9, color: "white", fontSize: 13, fontWeight: 700, cursor: actionState === "loading" ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: actionState === "loading" ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    {actionState === "loading" ? "Processing…" : (
                      <>
                        Forward to Admin
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionState === "loading"}
                    style={{ flex: 1, padding: "11px 0", background: "white", border: "1.5px solid #fca5a5", borderRadius: 9, color: "#dc2626", fontSize: 13, fontWeight: 700, cursor: actionState === "loading" ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: actionState === "loading" ? 0.5 : 1 }}>
                    {actionState === "loading" ? "Processing…" : "Reject Request"}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", padding: "80px 24px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <svg width="26" height="26" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#475569", margin: "0 0 6px" }}>
                  {requests.length === 0 ? "No pending requests" : "Select a request"}
                </p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                  {requests.length === 0 ? "All registrations have been reviewed." : "Select a request from the sidebar to view details."}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}