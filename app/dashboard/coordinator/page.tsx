

"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CoordinatorSession {
  id: string; fullName: string; email: string; region: string; rldc: string;
}
interface UserProfile {
  fullName: string; designation: string; email: string;
  altEmail?: string | null; phone: string; altPhone?: string | null;
}
interface UserRole { role: string; }
interface UserEntity {
  entityName: string; substation: string;
  ownerName: string; ownerEmail: string; ownerPhone: string; rldc: string;
}
interface UserMeter { id: string; meterNo: string; meterOwner: string; make?: string; locationId?: string; toDate?: string; status?: string; }
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
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "numeric", year: "numeric" });
}
function fmt(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ["Submitted", "Coordinator", "Admin", "Activation"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 4 }}>
      {steps.map((label, i) => {
        const done = i < currentStep + 1;
        const active = i === currentStep;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "#1d3461" : active ? "#1d3461" : "#e2e8f0",
                border: `2.5px solid ${done || active ? "#1d3461" : "#cbd5e1"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 12, fontWeight: 700,
              }}>
                {done && i < currentStep ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style={{ color: done || active ? "white" : "#94a3b8", fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: 11, fontWeight: active || done ? 700 : 500, color: active || done ? "#1d3461" : "#94a3b8", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 80, height: 2.5, background: i < currentStep ? "#1d3461" : "#e2e8f0", margin: "0 0 20px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoordinatorPage() {
  const [session, setSession] = useState<CoordinatorSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [actionMessage, setActionMessage] = useState("");
  const [remarks, setRemarks] = useState("");
  const [formData, setFormData] = useState({ assignedRole: "" });
  const [meterData, setMeterData] = useState<Record<string, { locationId: string; toDate: string }>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Session error");
        const data = await res.json();
        if (!cancelled) setSession(data.admin ?? null);
      } catch { if (!cancelled) setSession(null); }
      finally { if (!cancelled) setSessionLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!session) return;
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
  }, [session]);

  const selectedRequest = requests.find(r => r.id === selectedId);

  const handleForward = async () => {
    if (!selectedRequest) return;
    if (!formData.assignedRole) {
      setActionState("error");
      setActionMessage("Please assign a role before forwarding.");
      return;
    }
    setActionState("loading"); setActionMessage("");
    try {
      const res = await fetch("/api/coordinator/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: selectedRequest.userId, assignedRole: formData.assignedRole, remarks }),
      });
      const data = await res.json();
      if (!res.ok) { setActionState("error"); setActionMessage(data.error || "Something went wrong"); return; }
      setActionState("success"); setActionMessage(data.message || "Forwarded to Admin successfully");
      setRemarks(""); setFormData({ assignedRole: "" });
      const remaining = requests.filter(r => r.id !== selectedId);
      setRequests(remaining); setSelectedId(remaining[0]?.id ?? null);
      setTimeout(() => setActionState("idle"), 3000);
    } catch { setActionState("error"); setActionMessage("Network error. Please try again."); }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!remarks) {
      setActionState("error");
      setActionMessage("Remarks are required for rejection.");
      return;
    }
    setActionState("loading"); setActionMessage("");
    try {
      const res = await fetch("/api/coordinator/requests", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: selectedRequest.userId, remarks }),
      });
      const data = await res.json();
      if (!res.ok) { setActionState("error"); setActionMessage(data.error || "Something went wrong"); return; }
      setActionState("success"); setActionMessage(data.message || "Request rejected successfully");
      setRemarks("");
      const remaining = requests.filter(r => r.id !== selectedId);
      setRequests(remaining); setSelectedId(remaining[0]?.id ?? null);
      setTimeout(() => setActionState("idle"), 3000);
    } catch { setActionState("error"); setActionMessage("Network error. Please try again."); }
  };

  if (sessionLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#1d3461", borderRadius: "50%", margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ background: "white", borderRadius: 10, border: "1px solid #fecaca", padding: "28px 36px", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", margin: "0 0 5px" }}>Session Error</p>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Unable to load session. Please refresh or log in again.</p>
        </div>
      </div>
    );
  }

  const u = selectedRequest?.user;
  const displayReqId = selectedId ? `REQ-${selectedId.slice(-8).toUpperCase()}` : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .sidebar-item:hover { background: #f1f5f9 !important; }
        .reject-btn:hover { background: #fef2f2 !important; }
        .forward-btn:hover { background: #162d56 !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 268, background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          {/* Section 1: Coordinator name + email
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0" }}>
            <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.fullName}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{session.email}</p>
          </div> */}

          {/* Section 3: Pending Queue label */}
          <div style={{ padding: "11px 18px 6px" }}>
            <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8" }}>Pending Queue</p>
          </div>

          {/* Queue items */}
          <div style={{ flex: 1, overflowY: "auto", padding: "2px 10px 12px" }}>
            {requests.length === 0 ? (
              <div style={{ padding: "32px 10px", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No pending requests for {session.rldc}</p>
              </div>
            ) : (
              requests.map(r => {
                const active = selectedId === r.id;
                const reqId = `REQ-${r.id.slice(-8).toUpperCase()}`;
                
                const entityLine = [r.user.entity?.entityName, r.user.entity?.rldc || session.rldc].filter(Boolean).join(" · ");
                return (
                  <button
                    key={r.id}
                    className="sidebar-item"
                    onClick={() => { setSelectedId(r.id); setActionState("idle"); setActionMessage(""); setRemarks(""); setFormData({ assignedRole: "" }); setMeterData({}); }}
                    style={{
                      width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, marginBottom: 3, cursor: "pointer",
                      borderLeft: active ? "3px solid #1d3461" : "3px solid transparent",
                      borderTop: "none", borderRight: "none", borderBottom: "none",
                      background: active ? "#f0f4ff" : "transparent",
                      transition: "all .12s", fontFamily: "'Inter', sans-serif", display: "block",
                    }}
                  >
                    {/* Row 1: REQ ID + type badge */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                      <p style={{ margin: 0, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: active ? "#1d3461" : "#0f172a" }}>{reqId}</p>
                      
                    </div>
                    {/* Row 2: Entity · RLDC */}
                    {/* <p style={{ margin: "0 0 5px", fontSize: 11.5, fontWeight: 500, color: "#334155", lineHeight: 1.3 }}>
                      {  r.user.profile?.fullName || r.user.username}
                    </p> */}
                    {/* Row 3: Verification status pills */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {/* <span style={{ fontSize: 10, color: "#16a34a", fontWeight: 500 }}>✓ Details verified</span> */}
                      {/* span style={{ fontSize: 10, color: "#d97706", fontWeight: 500 }}>◦ Location IDs pendingspan */}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>

            {/* Toast messages */}
            {actionState === "success" && (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <div>
                  <p style={{ margin: "0 0 1px", fontSize: 12, fontWeight: 700, color: "#15803d" }}>Success</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#16a34a" }}>{actionMessage}</p>
                </div>
              </div>
            )}
            {actionState === "error" && actionMessage && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div>
                  <p style={{ margin: "0 0 1px", fontSize: 12, fontWeight: 700, color: "#92400e" }}>Action Failed</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#b45309" }}>{actionMessage}</p>
                </div>
              </div>
            )}

            {!selectedId ? (
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #e2e8f0", padding: "60px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: "0 0 4px" }}>No request selected</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Select a pending request from the queue to begin review.</p>
              </div>
            ) : selectedRequest && u ? (
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>

                {/* Header */}
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #e2e8f0" }}>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    {displayReqId} — {  u.profile?.fullName ?? u.username}
                  </h2>
                </div>

                <div style={{ padding: "20px" }}>

                  {/* Progress */}
                  <div style={{ marginBottom: 20 }}>
                    <ProgressBar currentStep={1} />
                    <p style={{ textAlign: "center", fontSize: 11, color: "#64748b", margin: "6px 0 0", fontWeight: 500 }}>
                      Step 2: Under coordinator review
                    </p>
                  </div>

                  {/* Info table — 2 col compact */}
                  <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", marginBottom: 14, fontSize: 12 }}>
                    <tbody>
                      {[
                        [
                          { label: "User type", value: u.userType, type: "badge-blue" },
                          { label: "RLDC", value: u.entity?.rldc || session.rldc, type: "bold" },
                        ],
                        [
                          { label: "Owner", value: u.entity?.ownerName ?? "—", type: "text" },
                          { label: "QCA", value: u.qcaDetails?.licenseNumber ?? "—", type: "text" },
                        ],
                        [
                          { label: "Mode", value: u.entity?.substation ?? "Non-AMR", type: "badge-amber" },
                          { label: "Meters", value: u.meters.length > 0 ? `${u.meters.length} (${u.meters.map(m => m.meterNo).join(", ")})` : "—", type: "text" },
                        ],
                        [
                          { label: "Contact", value: u.profile?.email ?? "—", type: "text" },
                          { label: "Submission Date", value: fmtDate(u.createdAt), type: "mono" },
                        ],
                      ].map((row, ri) => (
                        <tr key={ri} style={{ borderBottom: ri < 3 ? "1px solid #e2e8f0" : "none", background: ri % 2 === 0 ? "#fafbfc" : "white" }}>
                          {row.map((cell, ci) => (
                            <td key={ci} style={{ padding: "9px 10px", borderRight: ci === 0 ? "1px solid #e2e8f0" : "none", width: "50%", verticalAlign: "top" }}>
                              <p style={{ margin: "0 0 3px", fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "#94a3b8" }}>{cell.label}</p>
                              {cell.type === "text" && <p style={{ margin: 0, fontSize: 12.5, fontWeight: 500, color: "#0f172a" }}>{cell.value}</p>}
                              {cell.type === "bold" && <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{cell.value}</p>}
                              {cell.type === "mono" && <p style={{ margin: 0, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#475569" }}>{cell.value}</p>}
                              {cell.type === "badge-blue" && <span style={{ fontSize: 11, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: 5, fontWeight: 600 }}>{fmt(cell.value)}</span>}
                              {cell.type === "badge-amber" && <span style={{ fontSize: 11, background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a", padding: "2px 8px", borderRadius: 5, fontWeight: 600 }}>{cell.value}</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Meter table */}
                  {u.meters.length > 0 && (
                    <>
                      <div style={{ background: "#fffbeb", border: "1px solid #fde068", borderRadius: 7, padding: "9px 13px", marginBottom: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 13, marginTop: 1 }}>⚠</span>
                        <p style={{ margin: 0, fontSize: 11.5, color: "#78350f", fontWeight: 500 }}>Fill Location ID for each meter before forwarding. To Date editable if info received late.</p>
                      </div>

                      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", marginBottom: 16, fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            {["Meter No.", "Make", "Location ID * (Coordinator)", "To Date (editable)", "Status"].map((h, i) => (
                              <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: i === 2 ? "#b45309" : "#64748b", whiteSpace: "nowrap", borderRight: i < 4 ? "1px solid #e2e8f0" : "none" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {u.meters.map((m, i) => {
                            const md = meterData[m.id] ?? { locationId: m.locationId ?? "", toDate: m.toDate ?? "" };
                            const filled = md.locationId.trim().length > 0;
                            return (
                              <tr key={m.id} style={{ borderBottom: i < u.meters.length - 1 ? "1px solid #e2e8f0" : "none", background: i % 2 === 0 ? "white" : "#fafbfc" }}>
                                <td style={{ padding: "9px 12px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, color: "#0f172a", borderRight: "1px solid #e2e8f0" }}>{m.meterNo}</td>
                                <td style={{ padding: "9px 12px", color: "#475569", borderRight: "1px solid #e2e8f0" }}>{m.meterOwner}</td>
                                <td style={{ padding: "6px 10px", borderRight: "1px solid #e2e8f0" }}>
                                  <input
                                    type="text"
                                    value={md.locationId}
                                    placeholder={`LOC-${session.rldc}-${m.meterNo.replace(/\D/g, "")}`}
                                    onChange={e => setMeterData(prev => ({ ...prev, [m.id]: { ...md, locationId: e.target.value } }))}
                                    style={{ width: "100%", padding: "5px 9px", border: `1.5px solid ${filled ? "#fbbf24" : "#e2e8f0"}`, borderRadius: 6, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", background: filled ? "#fffbeb" : "white", outline: "none", color: "#0f172a" }}
                                  />
                                </td>
                                <td style={{ padding: "6px 10px", borderRight: "1px solid #e2e8f0" }}>
                                  <input
                                    type="date"
                                    value={md.toDate}
                                    onChange={e => setMeterData(prev => ({ ...prev, [m.id]: { ...md, toDate: e.target.value } }))}
                                    style={{ width: "100%", padding: "5px 9px", border: "1.5px solid #d1fae5", borderRadius: 6, fontSize: 12, background: "#f0fdf4", outline: "none", color: "#0f172a" }}
                                  />
                                </td>
                                <td style={{ padding: "9px 12px" }}>
                                  {filled ? (
                                    <span style={{ fontSize: 11, background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac", padding: "3px 9px", borderRadius: 5, fontWeight: 600 }}>✓ Filled</span>
                                  ) : (
                                    <span style={{ fontSize: 11, background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a", padding: "3px 9px", borderRadius: 5, fontWeight: 600 }}>Pending</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  )}

                  {/* Assign role + recommended by */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 5 }}>
                        Assign role <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <select
                          value={formData.assignedRole}
                          onChange={e => setFormData({ ...formData, assignedRole: e.target.value })}
                          disabled={actionState === "loading"}
                          style={{ width: "100%", padding: "9px 36px 9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 7, fontSize: 13, color: formData.assignedRole ? "#0f172a" : "#94a3b8", background: "white", outline: "none", fontFamily: "'Inter', sans-serif", cursor: "pointer", appearance: "none" }}
                        >
                          <option value="">Select role…</option>
                          <option value="SUBSTATION_USER">Substation User</option>
                          <option value="OWNER_COORDINATOR">Owner Coordinator</option>
                          <option value="QCA_USER">QCA User</option>
                        </select>
                        <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 5 }}>
                        Recommended by{" "}
                        <span style={{ fontWeight: 500, fontSize: 10, color: "#1d4ed8", background: "#eff6ff", padding: "1px 6px", borderRadius: 4 }}>auto — your logged-in name</span>
                      </label>
                      <input
                        type="text"
                        value={`${session.fullName} (Coordinator, ${session.rldc})`}
                        readOnly
                        style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 7, fontSize: 12.5, color: "#475569", background: "#f8fafc", outline: "none", fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  {/* Remarks */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 5 }}>Coordinator remarks</label>
                    <textarea
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      placeholder="Notes for RLDC Admin…"
                      disabled={actionState === "loading"}
                      rows={3}
                      style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 7, fontSize: 13, color: "#0f172a", background: "white", outline: "none", fontFamily: "'Inter', sans-serif", resize: "vertical", lineHeight: 1.6 }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                      className="reject-btn"
                      onClick={handleReject}
                      disabled={actionState === "loading"}
                      style={{ padding: "9px 20px", borderRadius: 7, fontSize: 13, fontWeight: 600, color: "#dc2626", background: "white", border: "1.5px solid #fecaca", cursor: actionState === "loading" ? "not-allowed" : "pointer", transition: "background 0.15s", fontFamily: "'Inter', sans-serif" }}
                    >
                      Return to applicant
                    </button>
                    <button
                      className="forward-btn"
                      onClick={handleForward}
                      disabled={actionState === "loading" || !formData.assignedRole}
                      style={{ padding: "9px 22px", borderRadius: 7, fontSize: 13, fontWeight: 700, color: "white", background: actionState === "loading" || !formData.assignedRole ? "#94a3b8" : "#1d3461", border: "none", cursor: actionState === "loading" || !formData.assignedRole ? "not-allowed" : "pointer", transition: "background 0.15s", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 7 }}
                    >
                      {actionState === "loading" ? (
                        <>
                          <div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                          Processing...
                        </>
                      ) : (
                        <>Forward to Admin ↗</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
