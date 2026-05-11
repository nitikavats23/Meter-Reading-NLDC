"use client";

import { useState, useEffect } from "react";
import ProgressBar from "@/components/ProgressBar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CoordinatorSession {
  id: string;
  fullName: string;
  email: string;
  region: string;
  rldc: string;
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
interface UserMeter { id: string; meterNo: string; meterOwner: string; }
interface UserQCA { licenseNumber: string; managedStations?: string | null; }
interface UserAssociateManager {
  id: string; name?: string | null; designation?: string | null;
  email?: string | null; phone?: string | null;
}
interface RequestUser {
  id: string; username: string; userType: string; regNumber: string; createdAt: string;
  profile: UserProfile | null; role: UserRole | null; entity: UserEntity | null;
  meters: UserMeter[]; qcaDetails: UserQCA | null;
  associateManagers: UserAssociateManager[];
}

interface PendingRequest {
  id: string; userId: string; regNumber: string; approverId: string | null;
  status: string; remarks: string | null; createdAt: string; user: RequestUser;
}
type ActionState = "idle" | "loading" | "success" | "error";

// ─── Region metadata ──────────────────────────────────────────────────────────

const RLDC_META: Record<string, { color: string; bg: string; border: string; full: string }> = {
  NRLDC: { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", full: "Northern Region" },
  WRLDC: { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", full: "Western Region" },
  SRLDC: { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", full: "Southern Region" },
  ERLDC: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", full: "Eastern Region" },
  NERLDC: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", full: "North-Eastern Region" },
};

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
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
          {title}
        </p>
      </div>
      <div style={{ padding: "18px 20px", fontFamily: "'DM Sans', sans-serif" }}>{children}</div>
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string | undefined | null }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {items.filter(i => i.value).map(({ label, value }) => (
        <div key={label}>
          <p style={{ margin: "0 0 3px", fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</p>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{value}</p>
        </div>
      ))}
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

  // ── Load session ──
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

  // ── Load requests after session ──
  useEffect(() => {
    if (!session) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/coordinator/requests?rldc=${session.rldc}`);
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
  const meta = session ? (RLDC_META[session.rldc] ?? RLDC_META["NRLDC"]) : null;

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
        body: JSON.stringify({ 
          registrationId: selectedRequest.userId, 
          assignedRole: formData.assignedRole, 
          remarks 
        }),
      });
      const data = await res.json();
      if (!res.ok) { setActionState("error"); setActionMessage(data.error || "Something went wrong"); return; }
      setActionState("success"); setActionMessage(data.message || "Forwarded to Admin successfully");
      setRemarks("");
      setFormData({ assignedRole: "" });
      const remaining = requests.filter(r => r.id !== selectedId);
      setRequests(remaining); setSelectedId(remaining[0]?.id ?? null);
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
    } catch { setActionState("error"); setActionMessage("Network error. Please try again."); }
  };

  if (sessionLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#0f172a", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: "white", borderRadius: 14, border: "1px solid #fecaca", padding: "32px 40px", textAlign: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#dc2626", margin: "0 0 6px" }}>Session Error</p>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Unable to load session. Please refresh or log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 288, background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ background: meta?.bg, borderBottom: `2px solid ${meta?.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: meta?.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "white", fontFamily: "'DM Mono', monospace" }}>{session.rldc.replace("RLDC", "")}</span>
            </div>
            <div>
              <p style={{ margin: "0 0 1px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.fullName}</p>
              <p style={{ margin: 0, fontSize: 11, color: meta?.color, fontWeight: 700 }}>{session.rldc} Coordinator</p>
              <p style={{ margin: "1px 0 0", fontSize: 10, color: "#64748b" }}>{meta?.full}</p>
            </div>
          </div>

          <div style={{ padding: "14px 18px 10px", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>Pending Queue</p>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
              Registrations
              {requests.length > 0 && (
                <span style={{ marginLeft: 8, background: "#1D4ED8", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, fontFamily: "'DM Mono', monospace", verticalAlign: "middle" }}>
                  {requests.length}
                </span>
              )}
            </h2>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {requests.length === 0 ? (
              <div style={{ padding: "48px 12px", textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: "0 0 4px" }}>All caught up</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No pending requests for {session.rldc}</p>
              </div>
            ) : (
              requests.map(r => {
                const active = selectedId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => { setSelectedId(r.id); setActionState("idle"); setActionMessage(""); setRemarks(""); }}
                    style={{
                      width: "100%", textAlign: "left", padding: "11px 13px", borderRadius: 10, marginBottom: 5, cursor: "pointer",
                      border: `1.5px solid ${active ? "#bfdbfe" : "#f1f5f9"}`,
                      background: active ? "#EFF6FF" : "white",
                      transition: "all .15s", fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: active ? "#1D4ED8" : "#64748b", letterSpacing: "0.04em" }}>
                      {r?.regNumber || r?.user?.regNumber || "—"}
                    </p>
                    
                    <p style={{ margin: "0 0 7px", fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>
                      {r.user.profile?.fullName ?? r.user.username}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, background: active ? "#1D4ED8" : "#f1f5f9", color: active ? "white" : "#64748b", padding: "2px 7px", borderRadius: 5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        {r.user.userType}
                      </span>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{relativeTime(r.createdAt)}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            <span style={{ fontSize: 10, color: "#94a3b8" }}>{session.rldc} — Online</span>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
            {selectedRequest ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8" }}>Registration Review</p>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>
                      {selectedRequest.user.profile?.fullName ?? selectedRequest.user.username}
                    </h1>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: meta?.bg, border: `1.5px solid ${meta?.border}`, borderRadius: 10, padding: "7px 14px" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta?.color, display: "inline-block" }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: meta?.color, fontFamily: "'DM Mono', monospace" }}>{session.rldc}</span>
                    </div>
                    <span style={{ background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a", padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm px-6 py-4 border border-slate-100">
                  <ProgressBar currentStep={1} />
                </div>

                <SectionCard title="Basic Information">
                  <InfoGrid items={[
                    { label: "User Type", value: selectedRequest.user.userType },
                    { label: "Username", value: selectedRequest.user.username },
                    { label: "Request ID", value: selectedRequest.id },
                    { label: "Received On", value: new Date(selectedRequest.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                  ]} />
                </SectionCard>

                {selectedRequest.user.profile && (
                  <SectionCard title="Contact Information">
                    <InfoGrid items={[
                      { label: "Full Name", value: selectedRequest.user.profile.fullName },
                      { label: "Designation", value: selectedRequest.user.profile.designation },
                      { label: "Email", value: selectedRequest.user.profile.email },
                      { label: "Phone", value: selectedRequest.user.profile.phone },
                    ]} />
                  </SectionCard>
                )}

                {selectedRequest.user.entity && (
                  <SectionCard title="Entity Information">
                    <InfoGrid items={[
                      { label: "Entity Name", value: selectedRequest.user.entity.entityName },
                      { label: "Substation", value: selectedRequest.user.entity.substation },
                      { label: "Owner Name", value: selectedRequest.user.entity.ownerName },
                      { label: "RLDC", value: selectedRequest.user.entity.rldc || "—" },
                    ]} />
                  </SectionCard>
                )}

                {selectedRequest.user.meters.length > 0 && (
                  <SectionCard title="Meters">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          {["#", "Meter No", "Owner"].map(h => (
                            <th key={h} style={{ padding: "8px 0", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" }}>{h}</th>
                          ))}
                  
                        
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRequest.user.meters.map((m, i) => (
                          <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "11px 0", fontSize: 13, color: "#94a3b8" }}>{i + 1}</td>
                            <td style={{ padding: "11px 0", fontSize: 13, fontWeight: 600, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>{m.meterNo}</td>
                            <td style={{ padding: "11px 0", fontSize: 13, color: "#475569" }}>{m.meterOwner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </SectionCard>
                )}

                {/* Assign Role Section */}
                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#64748b", marginBottom: 10 }}>
                    Assign Role <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    value={formData.assignedRole}
                    onChange={(e) => setFormData({ ...formData, assignedRole: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, background: "#f8fafc", outline: "none" }}
                  >
                    <option value="">Select Role</option>
                    <option value="SUBSTATION_USER">Substation User</option>
                    <option value="OWNER_COORDINATOR">Owner Coordinator</option>
                    <option value="QCA_USER">QCA User</option>
                  </select>
                </div>

                <div style={{ background: "white", borderRadius: 12, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#64748b", marginBottom: 10 }}>
                    Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Add remarks for the admin or applicant..."
                    rows={3}
                    style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, background: "#f8fafc", outline: "none", resize: "none" }}
                  />
                </div>

                {actionMessage && (
                  <div style={{ background: actionState === "success" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${actionState === "success" ? "#86efac" : "#fca5a5"}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, fontWeight: 600, color: actionState === "success" ? "#15803d" : "#dc2626" }}>
                    {actionMessage}
                  </div>
                )}

                <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
                  <button onClick={handleForward} disabled={actionState === "loading"}
                    style={{ flex: 1, padding: "12px", background: "#1D4ED8", color: "white", border: "none", borderRadius: 9, fontWeight: 700, cursor: "pointer", opacity: actionState === "loading" ? 0.7 : 1 }}>
                    {actionState === "loading" ? "Processing..." : "Forward to Admin"}
                  </button>
                  <button onClick={handleReject} disabled={actionState === "loading"}
                    style={{ flex: 1, padding: "12px", background: "white", color: "#dc2626", border: "1.5px solid #fca5a5", borderRadius: 9, fontWeight: 700, cursor: "pointer" }}>
                    Reject Request
                  </button>
                </div>
              </>
            ) : (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", padding: "80px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>Select a request to begin review</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}