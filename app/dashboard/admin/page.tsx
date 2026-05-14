
"use client";

import { useState, useEffect, useReducer } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminSession {
  id: string; fullName: string; email: string; rldc: string; region: string;
}
interface Coordinator {
  id: string; name: string; email: string; rldc: string; designation: string; isActive: boolean;
}
interface QueueItem {
  id: string; regNumber: string; applicantName: string;
  registrationType: string; coordinatorApprovedAt: string;
}
interface RegistrationRecord {
  id: string; regNumber: string; applicantName: string; applicantEmail: string;
  applicantPhone: string; registrationType: string; entityName: string;
  entityType: string; assignedRole: string; submittedAt: string;
  coordinatorApprovedAt: string | null; coordinatorRemarks: string | null;
  coordinator: { id: string; name: string; email: string } | null;
  documents: string[];
}
type ActionState = "idle" | "approving" | "rejecting" | "done-approve" | "done-reject" | "error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "numeric", year: "numeric" });
}
function fmt(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}


// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = ["Submitted", "Coordinator", "Admin", "Activation"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {steps.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: done || active ? "#1d3461" : "#e2e8f0",
                border: `2.5px solid ${done || active ? "#1d3461" : "#cbd5e1"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <span style={{ color: active ? "white" : "#94a3b8", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: 10.5, fontWeight: active || done ? 700 : 500, color: active || done ? "#1d3461" : "#94a3b8", whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 72, height: 2.5, background: i < currentStep ? "#1d3461" : "#e2e8f0", margin: "0 0 18px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Create Coordinator Modal ─────────────────────────────────────────────────

interface CoordForm {
  fullName: string; username: string; password: string;
  email: string; altEmail: string; phone: string; altPhone: string; designation: string;
}
const EMPTY_FORM: CoordForm = {
  fullName: "", username: "", password: "",
  email: "", altEmail: "", phone: "", altPhone: "", designation: "RLDC Coordinator",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 11px", border: "1.5px solid #e2e8f0",
  borderRadius: 7, fontSize: 12.5, color: "#0f172a", background: "#f8fafc",
  outline: "none", fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: "#374151", marginBottom: 4, fontFamily: "'Inter', sans-serif",
};

function CreateCoordinatorModal({ session, onClose, onCreate }: {
  session: AdminSession; onClose: () => void; onCreate: (c: Coordinator) => void;
}) {
  const [form, setForm] = useState<CoordForm>(EMPTY_FORM);
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function field(k: keyof CoordForm, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit() {
    setError("");
    if (!form.fullName || !form.username || !form.password || !form.email || !form.phone) {
      setError("Please fill in all required fields."); return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/coordinators", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, adminId: session.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create coordinator."); return; }
      onCreate(data.coordinator); onClose();
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
      <div style={{ background: "white", borderRadius: 12, width: "100%", maxWidth: 460, padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto", fontFamily: "'Inter', sans-serif" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: "0 0 3px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Create New Coordinator</h2>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
              Scoped to <strong>{session.rldc}</strong> — will become the sole active coordinator.
            </p>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", width: 30, height: 30, borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", flexShrink: 0 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* RLDC lock */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 7, padding: "8px 12px", marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>
          <svg width="12" height="12" fill="none" stroke="#1d4ed8" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          <span style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>Region-locked to {session.rldc}</span>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7, padding: "9px 13px", marginBottom: 14, color: "#dc2626", fontSize: 12 }}>{error}</div>
        )}

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle} placeholder="e.g. Priya Verma" value={form.fullName} onChange={(e) => field("fullName", e.target.value)} disabled={submitting} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={labelStyle}>Username *</label>
              <input style={inputStyle} placeholder="coord_nr_01" value={form.username} onChange={(e) => field("username", e.target.value)} disabled={submitting} />
            </div>
            <div>
              <label style={labelStyle}>Password *</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} style={{ ...inputStyle, paddingRight: 34 }} placeholder="••••••••" value={form.password} onChange={(e) => field("password", e.target.value)} disabled={submitting} />
                <button type="button" onClick={() => setShowPass((p) => !p)} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    {showPass
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Official Email *</label>
            <input type="email" style={inputStyle} placeholder="coord@grid-india.in" value={form.email} onChange={(e) => field("email", e.target.value)} disabled={submitting} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input style={inputStyle} placeholder="9876543210" value={form.phone} onChange={(e) => field("phone", e.target.value)} disabled={submitting} />
            </div>
            <div>
              <label style={labelStyle}>Designation</label>
              <input style={inputStyle} value={form.designation} onChange={(e) => field("designation", e.target.value)} disabled={submitting} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={labelStyle}>Alt. Email <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
              <input type="email" style={inputStyle} placeholder="alt@grid-india.in" value={form.altEmail} onChange={(e) => field("altEmail", e.target.value)} disabled={submitting} />
            </div>
            <div>
              <label style={labelStyle}>Alt. Phone <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
              <input style={inputStyle} placeholder="9876543210" value={form.altPhone} onChange={(e) => field("altPhone", e.target.value)} disabled={submitting} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} disabled={submitting} style={{ flex: 1, padding: "9px", background: "#f1f5f9", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#475569" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: "9px", background: submitting ? "#64748b" : "#1d3461", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", color: "white" }}>
            {submitting ? "Creating…" : "Create Coordinator"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── On Approval Section ──────────────────────────────────────────────────────

function OnApprovalSection({ record }: { record: RegistrationRecord }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#94a3b8" }}>
        On Approval — <span style={{ color: "#64748b", fontWeight: 600, textTransform: "none" }}>both triggered simultaneously</span>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 9, padding: "12px 14px" }}>
          <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: "#1e3a8a" }}>📧 Activation email</p>
          <p style={{ margin: "0 0 5px", fontSize: 10.5, color: "#2563eb", fontWeight: 600 }}>To: {record.applicantEmail}</p>
          <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.55 }}>Contains <strong>auto-assigned username</strong> + secure activation link (48 hrs). Click verifies email and opens OTP page.</p>
        </div>
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 9, padding: "12px 14px" }}>
          <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: "#14532d" }}>📱 MFA OTP to primary contact</p>
          <p style={{ margin: "0 0 5px", fontSize: 10.5, color: "#16a34a", fontWeight: 600 }}>To: {record.applicantPhone}</p>
          <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.55 }}><strong>6-digit OTP</strong> for contact verification. Valid 10 minutes. Via Grid-India SMS gateway.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Coordinator Card (Sidebar) ───────────────────────────────────────────────

function CoordinatorCard({ coordinator, loading, onToggle, onCreateNew }: {
  coordinator: Coordinator | null;
  loading: boolean;
  onToggle: () => void;
  onCreateNew: () => void;
}) {
  const isActive = coordinator?.isActive ?? false;

  return (
    <div style={{ padding: "12px 16px", borderBottom: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Coordinator</p>
        {coordinator && !loading && (
          /* Active / Inactive toggle */
          <button
            onClick={onToggle}
            title={isActive ? "Click to deactivate" : "Click to activate"}
            style={{
              width: 38, height: 21, borderRadius: 11, border: "none", cursor: "pointer",
              background: isActive ? "#22c55e" : "#cbd5e1",
              position: "relative", flexShrink: 0, transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 17, height: 17, background: "white", borderRadius: "50%",
              position: "absolute", top: 2,
              left: isActive ? 19 : 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              transition: "left 0.2s",
            }} />
          </button>
        )}
      </div>

      <div style={{ background: "#f8fafc", padding: "9px 11px", borderRadius: 7, border: "1px solid #e2e8f0" }}>
        {loading ? (
          <div style={{ height: 32, background: "#f1f5f9", borderRadius: 5 }} />
        ) : coordinator ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{coordinator.name}</p>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 99,
                background: isActive ? "#dcfce7" : "#fef2f2",
                color: isActive ? "#16a34a" : "#dc2626",
                border: `1px solid ${isActive ? "#86efac" : "#fecaca"}`,
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p style={{ margin: "0 0 1px", fontSize: 10.5, color: "#64748b" }}>{coordinator.email}</p>
            <p style={{ margin: "0 0 8px", fontSize: 10, color: "#94a3b8" }}>{coordinator.designation} · {coordinator.rldc}</p>

            {/* Create new — only enabled when inactive */}
            {!isActive ? (
              <button
                onClick={onCreateNew}
                style={{
                  width: "100%", padding: "5px 0", fontSize: 10.5,
                  background: "#1d3461", color: "white", border: "none",
                  borderRadius: 5, fontWeight: 700, cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                + Create New Coordinator
              </button>
            ) : (
              <div style={{
                width: "100%", padding: "5px 0", fontSize: 10, textAlign: "center",
                background: "#f1f5f9", color: "#94a3b8", borderRadius: 5,
                fontWeight: 600, letterSpacing: "0.03em",
                border: "1px dashed #cbd5e1",
              }}>
                Deactivate current to create new
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 7px", fontSize: 11, color: "#e11d48", fontWeight: 600 }}>No coordinator assigned</p>
            <button
              onClick={onCreateNew}
              style={{ width: "100%", padding: "5px 0", fontSize: 10, background: "#1d3461", color: "white", border: "none", borderRadius: 5, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}
            >
              CREATE COORDINATOR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminApprovalPage() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [coordLoading, setCoordLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ── Queue reducer ──
  type QueueState = { items: QueueItem[]; selectedId: string | null; loading: boolean; error: string | null };
  type QueueAction =
    | { type: "LOADED"; items: QueueItem[] } | { type: "ERROR"; message: string }
    | { type: "SELECT"; id: string | null } | { type: "REMOVE"; id: string };

  function queueReducer(s: QueueState, a: QueueAction): QueueState {
    switch (a.type) {
      case "LOADED": return { items: a.items, selectedId: a.items[0]?.id ?? null, loading: false, error: null };
      case "ERROR":  return { ...s, loading: false, error: a.message };
      case "SELECT": return { ...s, selectedId: a.id };
      case "REMOVE": {
        const items = s.items.filter((x) => x.id !== a.id);
        return { ...s, items, selectedId: s.selectedId === a.id ? (items[0]?.id ?? null) : s.selectedId };
      }
    }
  }
  const [queueState, dispatchQueue] = useReducer(queueReducer, { items: [], selectedId: null, loading: true, error: null });
  const { items: queue, selectedId, loading: queueLoading, error: queueError } = queueState;

  // ── Record reducer ──
  type RecordState = { data: RegistrationRecord | null; loading: boolean; error: string | null; remarks: string; actionState: ActionState; actionError: string | null };
  type RecordAction =
    | { type: "FETCH_START" } | { type: "FETCH_OK"; data: RegistrationRecord } | { type: "FETCH_ERR"; message: string }
    | { type: "SET_REMARKS"; value: string }
    | { type: "ACTION_START"; action: "approve" | "reject" }
    | { type: "ACTION_OK"; action: "approve" | "reject" }
    | { type: "ACTION_ERR"; message: string }
    | { type: "RESET" };

  function recordReducer(s: RecordState, a: RecordAction): RecordState {
    switch (a.type) {
      case "FETCH_START": return { data: null, loading: true, error: null, remarks: "", actionState: "idle", actionError: null };
      case "FETCH_OK":    return { ...s, data: a.data, loading: false };
      case "FETCH_ERR":   return { ...s, error: a.message, loading: false };
      case "SET_REMARKS": return { ...s, remarks: a.value };
      case "ACTION_START": return { ...s, actionState: a.action === "approve" ? "approving" : "rejecting", actionError: null };
      case "ACTION_OK":    return { ...s, actionState: a.action === "approve" ? "done-approve" : "done-reject" };
      case "ACTION_ERR":   return { ...s, actionState: "error", actionError: a.message };
      case "RESET":        return { data: null, loading: false, error: null, remarks: "", actionState: "idle", actionError: null };
    }
  }
  const [recState, dispatchRec] = useReducer(recordReducer, { data: null, loading: false, error: null, remarks: "", actionState: "idle", actionError: null });
  const { data: record, loading: recordLoading, error: recordError, remarks, actionState, actionError } = recState;

  // ── Load session ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Session expired");
        const data = await res.json();
        if (!cancelled) setSession(data.admin ?? null);
      } catch { if (!cancelled) setSession(null); }
      finally { if (!cancelled) setSessionLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Load coordinator from API (merges with default) ──
  useEffect(() => {
  fetchCoordinator();
}, []);

async function fetchCoordinator() {
  try {
    setCoordLoading(true);

    const res = await fetch("/api/admin/coordinators");

    if (!res.ok) {
      throw new Error("Failed to fetch coordinators");
    }

    const data = await res.json();

    setCoordinators(data);
  } catch (err) {
    console.error(err);
  } finally {
    setCoordLoading(false);
  }
}

  // ── Load queue ──
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/registrations/coordinator-approved", {
          headers: { "Content-Type": "application/json", "x-admin-id": session.id },
        });
        if (!res.ok) throw new Error("Failed to load queue");
        const items = (await res.json()) as QueueItem[];
        if (!cancelled) dispatchQueue({ type: "LOADED", items });
      } catch (e) {
        if (!cancelled) dispatchQueue({ type: "ERROR", message: e instanceof Error ? e.message : "Failed to load queue." });
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  // ── Load record ──
  useEffect(() => {
    if (!selectedId) { dispatchRec({ type: "RESET" }); return; }
    dispatchRec({ type: "FETCH_START" });
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/registrations/${selectedId}`);
        if (!res.ok) throw new Error("Failed to load record");
        const data = (await res.json()) as RegistrationRecord;
        if (!cancelled) dispatchRec({ type: "FETCH_OK", data });
      } catch (e) {
        if (!cancelled) dispatchRec({ type: "FETCH_ERR", message: e instanceof Error ? e.message : "Failed to load." });
      }
    })();
    return () => { cancelled = true; };
  }, [selectedId]);

  // ── Submit review ──
  async function submitReview(action: "approve" | "reject") {
    if (!selectedId || actionState !== "idle") return;
    if (action === "reject" && !remarks.trim()) return;
    dispatchRec({ type: "ACTION_START", action });
    try {
      const res = await fetch(`/api/registrations/${selectedId}/admin-review`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminId: session?.id, remarks }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Unknown error"); }
      dispatchRec({ type: "ACTION_OK", action });
      dispatchQueue({ type: "REMOVE", id: selectedId });
    } catch (e) {
      dispatchRec({ type: "ACTION_ERR", message: e instanceof Error ? e.message : "Unexpected error." });
    }
  }

  // ── Toggle coordinator active/inactive ──
  async function toggleCoordinator(coord: Coordinator) {
  const newActive = !coord.isActive;

  try {
    await fetch("/api/admin/coordinators", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinatorId: coord.id,
        isActive: newActive,
      }),
    });

    fetchCoordinator();

  } catch (err) {
    console.error(err);
  }
}
  if (sessionLoading) {
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

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f4f6f9", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .queue-item:hover { background: #f1f5f9 !important; }
        .reject-btn:hover { background: #fef2f2 !important; }
        .approve-btn:hover { background: #162d56 !important; }
      `}</style>

      {showCreateModal && session && (
        <CreateCoordinatorModal
          session={session}
          onClose={() => setShowCreateModal(false)}
          onCreate={(newCoordinator) =>
  setCoordinators((prev) => [...prev, newCoordinator])
}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{ width: 260, borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", background: "white", flexShrink: 0 }}>

        {/* {/* Admin profile
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0" }}>
          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.fullName}</p>
          <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{session.email}</p>
        </div>  */}

        {/* Coordinator card — replaces old card + tab */}
        {coordinators.map((coord) => (
  <CoordinatorCard
    key={coord.id}
    coordinator={coord}
    loading={coordLoading}
    onToggle={() => toggleCoordinator(coord)}
    onCreateNew={() => setShowCreateModal(true)}
  />
))}

        {/* Queue header */}
        <div style={{ padding: "8px 18px 5px", borderBottom: "1px solid transparent" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8" }}>Pending Queue</p>
            {!queueLoading && queue.length > 0 && (
              <span style={{ background: "#1d3461", color: "white", fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 99, lineHeight: 1.7, fontFamily: "'IBM Plex Mono', monospace" }}>{queue.length}</span>
            )}
          </div>
        </div>

        {/* Queue list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2px 10px 10px" }}>
          {queueLoading
            ? [1, 2, 3].map((i) => <div key={i} style={{ height: 58, background: "#f1f5f9", borderRadius: 8, marginBottom: 5 }} />)
            : queueError
              ? <div style={{ padding: "32px 10px", textAlign: "center" }}><p style={{ fontSize: 12, color: "#f87171" }}>{queueError}</p></div>
              : queue.length === 0
                ? <div style={{ padding: "40px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#475569", margin: "0 0 3px" }}>All caught up</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>No pending requests</p>
                  </div>
                : queue.map((req) => {
                    const active = selectedId === req.id;
                    return (
                      <button
                        key={req.id}
                        className="queue-item"
                        onClick={() => dispatchQueue({ type: "SELECT", id: req.id })}
                        style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, marginBottom: 3, cursor: "pointer", borderLeft: active ? "3px solid #1d3461" : "3px solid transparent", borderTop: "none", borderRight: "none", borderBottom: "none", background: active ? "#f0f4ff" : "transparent", fontFamily: "'Inter', sans-serif", display: "block", transition: "all .12s" }}
                      >
                        <p style={{ margin: "0 0 2px", fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: active ? "#1d3461" : "#0f172a" }}>{req.regNumber}</p>
                        
                      </button>
                    );
                  })}
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      

        <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Progress */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 20px" }}>
              <ProgressBar currentStep={2} />
              <p style={{ textAlign: "center", fontSize: 11, color: "#64748b", margin: "6px 0 0", fontWeight: 500 }}>Step 3: Under admin approval process</p>
            </div>

            {/* Toasts */}
            {actionState === "done-approve" && (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <div>
                  <p style={{ margin: "0 0 1px", fontSize: 12, fontWeight: 700, color: "#15803d" }}>Request Approved</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#16a34a" }}>Activation email and OTP dispatched. Select another request from the queue.</p>
                </div>
              </div>
            )}
            {actionState === "done-reject" && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>❌</span>
                <div>
                  <p style={{ margin: "0 0 1px", fontSize: 12, fontWeight: 700, color: "#dc2626" }}>Request Rejected</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#ef4444" }}>The applicant has been notified. Select another request from the queue.</p>
                </div>
              </div>
            )}
            {actionState === "error" && actionError && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div>
                  <p style={{ margin: "0 0 1px", fontSize: 12, fontWeight: 700, color: "#92400e" }}>Action Failed</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#b45309" }}>{actionError}</p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!selectedId && !actionState.startsWith("done") && (
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #e2e8f0", padding: "60px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: "0 0 4px" }}>No request selected</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Select a coordinator-approved request from the queue to begin review.</p>
              </div>
            )}

            {/* Record detail */}
            {selectedId && (
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>

                {/* Card header */}
                <div style={{ padding: "13px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h2 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Final Approval — RLDC Admin</h2>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>Review the coordinator-forwarded request and grant or reject final approval.</p>
                  </div>
                  <span style={{ fontSize: 9.5, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", padding: "3px 9px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>Step 3 / 4</span>
                </div>

                {recordLoading && (
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    {[90, 64, 80].map((h, i) => <div key={i} style={{ height: h, background: "#f1f5f9", borderRadius: 8 }} />)}
                  </div>
                )}
                {recordError && <div style={{ padding: "40px 24px", textAlign: "center" }}><p style={{ fontSize: 13, color: "#f87171" }}>{recordError}</p></div>}

                {!recordLoading && !recordError && record && (
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Request summary table */}
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#94a3b8" }}>Request Summary</p>
                      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", fontSize: 12 }}>
                        <tbody>
                          {[
                            [
                              { label: "Reg ID",     value: record.regNumber,               type: "mono" },
                              { label: "Applicant",  value: record.applicantName,            type: "text" },
                            ],
                            [
                              { label: "Entity",     value: record.entityName,               type: "text" },
                              { label: "Type",       value: record.entityType,               type: "text" },
                            ],
                            [
                              { label: "Reg. Type",  value: fmt(record.registrationType),   type: "badge-blue" },
                              { label: "Assigned Role", value: fmt(record.assignedRole),     type: "badge-blue" },
                            ],
                            [
                              { label: "Submitted",        value: fmtDate(record.submittedAt),           type: "mono" },
                              { label: "Coord. Approved",  value: fmtDate(record.coordinatorApprovedAt), type: "mono" },
                            ],
                          ].map((row, ri) => (
                            <tr key={ri} style={{ borderBottom: ri < 3 ? "1px solid #e2e8f0" : "none", background: ri % 2 === 0 ? "#fafbfc" : "white" }}>
                              {row.map((cell, ci) => (
                                <td key={ci} style={{ padding: "9px 12px", borderRight: ci === 0 ? "1px solid #e2e8f0" : "none", width: "50%", verticalAlign: "top" }}>
                                  <p style={{ margin: "0 0 3px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>{cell.label}</p>
                                  {cell.type === "text" && <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{cell.value}</p>}
                                  {cell.type === "mono" && <p style={{ margin: 0, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#475569" }}>{cell.value}</p>}
                                  {cell.type === "badge-blue" && <span style={{ fontSize: 11, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: 5, fontWeight: 600 }}>{cell.value}</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Coordinator review */}
                    {/* <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "13px 16px" }}>
                      <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#92400e" }}>Coordinator Review</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                        <div>
                          <p style={{ margin: "0 0 3px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>Reviewed By</p>
                          <p style={{ margin: "0 0 1px", fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{record.coordinator?.name ?? "—"}</p>
                          {record.coordinator?.email && <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{record.coordinator.email}</p>}
                        </div>
                        <div>
                          <p style={{ margin: "0 0 3px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>Reviewed At</p>
                          <p style={{ margin: 0, fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace", color: "#475569" }}>{fmtDate(record.coordinatorApprovedAt)}</p>
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 3px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}>Remarks</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#475569", fontStyle: "italic", lineHeight: 1.55 }}>
                          {record.coordinatorRemarks ? `"${record.coordinatorRemarks}"` : "No remarks provided."}
                        </p>
                      </div>
                    </div>

                    {/* Documents }
                    {record.documents?.length > 0 && (
                      <div>
                        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#94a3b8" }}>Submitted Documents</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {record.documents.map((doc) => (
                            <span key={doc} style={{ fontSize: 11.5, background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", padding: "4px 10px", borderRadius: 6, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                              <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )} */}

                    {/* Coordinator review */}
                     <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "13px 16px" }}>
                    <div>
                        <p style={{ margin: "0 0 3px", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8" }}> Coordinator Remarks</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#475569", fontStyle: "italic", lineHeight: 1.55 }}>
                          {record.coordinatorRemarks ? `"${record.coordinatorRemarks}"` : "No remarks provided."}
                        </p>
                      </div>
                      </div>

                    {/* On Approval */}
                    <OnApprovalSection record={record} />

                    {/* Decision */}
                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                      <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: "#1d3461", textTransform: "uppercase", letterSpacing: "0.07em" }}>Administrative Decision</p>
                      <div style={{ marginBottom: 12 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 5 }}>
                          Admin Remarks <span style={{ fontWeight: 400, color: "#94a3b8" }}>(required when rejecting)</span>
                        </label>
                        <textarea
                          value={remarks}
                          onChange={(e) => dispatchRec({ type: "SET_REMARKS", value: e.target.value })}
                          placeholder="Enter your remarks or reason for rejection…"
                          disabled={actionState !== "idle"}
                          rows={3}
                          style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 7, fontSize: 13, color: "#0f172a", background: actionState !== "idle" ? "#f8fafc" : "white", outline: "none", fontFamily: "'Inter', sans-serif", resize: "vertical", lineHeight: 1.6, opacity: actionState !== "idle" ? 0.6 : 1 }}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
                        {!remarks.trim() && actionState === "idle" && (
                          <p style={{ margin: 0, fontSize: 10.5, color: "#94a3b8" }}>← Add a remark to enable rejection</p>
                        )}
                        <button
                          className="reject-btn"
                          onClick={() => submitReview("reject")}
                          disabled={!remarks.trim() || actionState !== "idle"}
                          style={{ padding: "9px 20px", border: "1.5px solid #fecaca", borderRadius: 7, background: "white", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: (!remarks.trim() || actionState !== "idle") ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", opacity: (!remarks.trim() || actionState !== "idle") ? 0.45 : 1, transition: "background 0.15s" }}
                        >
                          {actionState === "rejecting" ? "Rejecting…" : "Reject"}
                        </button>
                        <button
                          className="approve-btn"
                          onClick={() => submitReview("approve")}
                          disabled={actionState !== "idle"}
                          style={{ padding: "9px 22px", background: actionState !== "idle" ? "#94a3b8" : "#1d3461", border: "none", borderRadius: 7, color: "white", fontSize: 13, fontWeight: 700, cursor: actionState !== "idle" ? "not-allowed" : "pointer", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 7, transition: "background 0.15s", boxShadow: actionState === "idle" ? "0 2px 8px rgba(29,52,97,0.25)" : "none" }}
                        >
                          {actionState === "approving" ? "Approving…" : (
                            <>Grant Final Approval <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}