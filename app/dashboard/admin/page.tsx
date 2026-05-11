// "use client";

// import { useState, useEffect, useReducer } from "react";
// import ProgressBar from "@/components/ProgressBar";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type Region = "NR" | "WR" | "SR" | "ER" | "NER";

// interface AdminSession {
//   id: string; fullName: string; email: string; region: Region; rldc: string;
// }
// interface QueueItem {
//   id: string; regNumber: string; applicantName: string;
//   registrationType: string; coordinatorApprovedAt: string;
// }
// interface RegistrationRecord {
//   id: string; regNumber: string; applicantName: string;
//   applicantEmail: string; applicantPhone: string;
//   registrationType: string; entityName: string; entityType: string;
//   assignedRole: string; documents: string[];
//   coordinator: { id: string; name: string; email: string } | null;
//   coordinatorRemarks: string | null; coordinatorApprovedAt: string | null; submittedAt: string;
// }
// type SidebarTab = "requests" | "create-coordinator";
// type ActionState = "idle" | "approving" | "rejecting" | "done-approve" | "done-reject" | "error";

// // ─── Region metadata ──────────────────────────────────────────────────────────

// const REGION_META: Record<Region, { label: string; full: string; color: string; bg: string; border: string }> = {
//   NR:  { label: "NR",  full: "Northern Region",      color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
//   WR:  { label: "WR",  full: "Western Region",       color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
//   SR:  { label: "SR",  full: "Southern Region",      color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
//   ER:  { label: "ER",  full: "Eastern Region",       color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
//   NER: { label: "NER", full: "North-Eastern Region", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function relativeTime(iso: string): string {
//   const diff = Date.now() - new Date(iso).getTime();
//   const hrs = Math.floor(diff / 3_600_000);
//   if (hrs < 1) return "just now";
//   if (hrs < 24) return `${hrs}h ago`;
//   return `${Math.floor(hrs / 24)}d ago`;
// }
// function fmtDate(iso: string | null): string {
//   if (!iso) return "—";
//   return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
// }
// function fmt(s: string): string {
//   return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
// }

// // ─── Create Coordinator Panel ─────────────────────────────────────────────────

// interface CoordForm {
//   fullName: string; username: string; password: string;
//   email: string; altEmail: string; phone: string; altPhone: string; designation: string;
// }
// const EMPTY: CoordForm = { fullName: "", username: "", password: "", email: "", altEmail: "", phone: "", altPhone: "", designation: "RLDC Coordinator" };

// const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "'DM Sans', sans-serif" };
// const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#0f172a", background: "#f8fafc", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" as const };

// function CreateCoordinatorPanel({ session }: { session: AdminSession }) {
//   const meta = REGION_META[session.region];
//   const [form, setForm] = useState<CoordForm>(EMPTY);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [showPass, setShowPass] = useState(false);

//   function field(k: keyof CoordForm, v: string) { setForm(f => ({ ...f, [k]: v })); }

//   async function submit() {
//     setError("");
//     if (!form.fullName || !form.username || !form.password || !form.email || !form.phone) {
//       setError("Please fill all required fields."); return;
//     }
//     setSubmitting(true);
//     try {
//       const res = await fetch("/api/admin/coordinators", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...form, adminId: session.id }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setSuccess(`Coordinator "${form.fullName}" created for ${meta.full}.`);
//         setForm(EMPTY);
//         setTimeout(() => setSuccess(""), 7000);
//       } else { setError(data.message || "Failed to create coordinator."); }
//     } catch { setError("Something went wrong."); }
//     finally { setSubmitting(false); }
//   }

//   return (
//     <div style={{ flex: 1, overflowY: "auto" }}>
//       {/* Region banner */}
//       <div style={{ background: meta.bg, borderBottom: `2px solid ${meta.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
//         <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//           <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//         </div>
//         <div>
//           <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: meta.color, margin: "0 0 2px", fontFamily: "'DM Sans', sans-serif" }}>Region-Locked</p>
//           <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{session.rldc} — {meta.full}</p>
//           <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0", fontFamily: "'DM Sans', sans-serif" }}>Coordinators assigned to {meta.label} only</p>
//         </div>
//       </div>

//       <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
//         {success && (
//           <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 9, padding: "10px 13px", fontSize: 12, color: "#15803d", display: "flex", gap: 8, alignItems: "center", fontFamily: "'DM Sans', sans-serif" }}>
//             <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
//             {success}
//           </div>
//         )}
//         {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 9, padding: "10px 13px", fontSize: 12, color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}

//         {/* Zone (locked) */}
//         <div>
//           <label style={labelStyle}>RLDC Zone <span style={{ fontWeight: 400, color: "#94a3b8" }}>(auto-assigned)</span></label>
//           <div style={{ ...inputStyle, background: meta.bg, border: `1.5px solid ${meta.border}`, color: meta.color, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, cursor: "not-allowed" }}>
//             <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
//             {session.rldc} — {meta.full}
//             <svg width="12" height="12" fill="none" stroke={meta.color} strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: "auto", opacity: 0.6 }}>
//               <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
//             </svg>
//           </div>
//         </div>

//         <div>
//           <label style={labelStyle}>Full Name *</label>
//           <input style={inputStyle} placeholder="e.g. Priya Verma" value={form.fullName} onChange={e => field("fullName", e.target.value)} disabled={submitting} />
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//           <div>
//             <label style={labelStyle}>Username *</label>
//             <input style={inputStyle} placeholder="coord_nr_01" value={form.username} onChange={e => field("username", e.target.value)} disabled={submitting} />
//           </div>
//           <div>
//             <label style={labelStyle}>Password *</label>
//             <div style={{ position: "relative" }}>
//               <input type={showPass ? "text" : "password"} style={{ ...inputStyle, paddingRight: 36 }} placeholder="••••••••" value={form.password} onChange={e => field("password", e.target.value)} disabled={submitting} />
//               <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
//                 <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                   {showPass
//                     ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     : <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>}
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>

//         <div>
//           <label style={labelStyle}>Official Email *</label>
//           <input type="email" style={inputStyle} placeholder="name@rldc.gov.in" value={form.email} onChange={e => field("email", e.target.value)} disabled={submitting} />
//         </div>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
//           <div>
//             <label style={labelStyle}>Phone *</label>
//             <input style={inputStyle} placeholder="9876543210" value={form.phone} onChange={e => field("phone", e.target.value)} disabled={submitting} />
//           </div>
//           <div>
//             <label style={labelStyle}>Designation</label>
//             <input style={inputStyle} value={form.designation} onChange={e => field("designation", e.target.value)} disabled={submitting} />
//           </div>
//         </div>

//         <div>
//           <label style={labelStyle}>Alternate Email <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
//           <input type="email" style={inputStyle} placeholder="alt@rldc.gov.in" value={form.altEmail} onChange={e => field("altEmail", e.target.value)} disabled={submitting} />
//         </div>

//         <div>
//           <label style={labelStyle}>Alternate Phone <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
//           <input style={inputStyle} placeholder="9876543210" value={form.altPhone} onChange={e => field("altPhone", e.target.value)} disabled={submitting} />
//         </div>

//         <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 9, padding: "10px 13px", fontSize: 11.5, color: "#0369a1", lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
//           <strong>On creation:</strong> Account activates immediately and is scoped to <strong>{meta.full}</strong> only.
//         </div>

//         <button onClick={submit} disabled={submitting}
//           style={{ width: "100%", padding: "11px 0", background: submitting ? "#64748b" : "#0f172a", border: "none", borderRadius: 9, color: "white", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em" }}>
//           {submitting ? "Creating…" : `Create ${meta.label} Coordinator ↗`}
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function AdminApprovalPage() {
//   const [session, setSession] = useState<AdminSession | null>(null);
//   const [sessionLoading, setSessionLoading] = useState(true);
//   const [tab, setTab] = useState<SidebarTab>("requests");

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const res = await fetch("/api/auth/me");
//         if (!res.ok) throw new Error("Session expired");
//         const data = await res.json();
//         if (!cancelled) setSession(data.admin ?? null);
//       } catch { if (!cancelled) setSession(null); }
//       finally { if (!cancelled) setSessionLoading(false); }
//     })();
//     return () => { cancelled = true; };
//   }, []);

//   // ── Queue reducer ──
//   type QueueState = { items: QueueItem[]; selectedId: string | null; loading: boolean; error: string | null; };
//   type QueueAction = { type: "LOADED"; items: QueueItem[] } | { type: "ERROR"; message: string } | { type: "SELECT"; id: string | null };

//   function queueReducer(s: QueueState, a: QueueAction): QueueState {
//     switch (a.type) {
//       case "LOADED": return { items: a.items, selectedId: a.items[0]?.id ?? null, loading: false, error: null };
//       case "ERROR":  return { ...s, loading: false, error: a.message };
//       case "SELECT": return { ...s, selectedId: a.id };
//     }
//   }
//   const [queueState, dispatchQueue] = useReducer(queueReducer, { items: [], selectedId: null, loading: true, error: null });
//   const { items: queue, selectedId, loading: queueLoading, error: queueError } = queueState;

//   // ── Record reducer ──
//   type RecordState = { data: RegistrationRecord | null; loading: boolean; error: string | null; remarks: string; actionState: ActionState; actionError: string | null; };
//   type RecordAction =
//     | { type: "FETCH_START" } | { type: "FETCH_OK"; data: RegistrationRecord } | { type: "FETCH_ERR"; message: string }
//     | { type: "SET_REMARKS"; value: string }
//     | { type: "ACTION_START"; action: "approve" | "reject" } | { type: "ACTION_OK"; action: "approve" | "reject" } | { type: "ACTION_ERR"; message: string };

//   function recordReducer(s: RecordState, a: RecordAction): RecordState {
//     switch (a.type) {
//       case "FETCH_START": return { data: null, loading: true, error: null, remarks: "", actionState: "idle", actionError: null };
//       case "FETCH_OK":    return { ...s, data: a.data, loading: false };
//       case "FETCH_ERR":   return { ...s, error: a.message, loading: false };
//       case "SET_REMARKS": return { ...s, remarks: a.value };
//       case "ACTION_START": return { ...s, actionState: a.action === "approve" ? "approving" : "rejecting", actionError: null };
//       case "ACTION_OK":    return { ...s, actionState: a.action === "approve" ? "done-approve" : "done-reject" };
//       case "ACTION_ERR":   return { ...s, actionState: "error", actionError: a.message };
//     }
//   }
//   const [recState, dispatchRec] = useReducer(recordReducer, { data: null, loading: false, error: null, remarks: "", actionState: "idle", actionError: null });
//   const { data: record, loading: recordLoading, error: recordError, remarks, actionState, actionError } = recState;

//   useEffect(() => {
//     if (!session) return;
//     let cancelled = false;
//     (async () => {
//       try {
//         const res = await fetch(`/api/registrations/coordinator-approved?region=${session.rldc}`);
//         if (!res.ok) throw new Error("Failed to load queue");
//         const items = await res.json() as QueueItem[];
//         if (!cancelled) dispatchQueue({ type: "LOADED", items });
//       } catch (e) {
//         if (!cancelled) dispatchQueue({ type: "ERROR", message: e instanceof Error ? e.message : "Failed to load queue." });
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [session]);

//   useEffect(() => {
//     if (!selectedId) return;
//     dispatchRec({ type: "FETCH_START" });
//     let cancelled = false;
//     (async () => {
//       try {
//         const res = await fetch(`/api/registrations/${selectedId}`);
//         if (!res.ok) throw new Error("Failed to load record");
//         const data = await res.json() as RegistrationRecord;
//         if (!cancelled) dispatchRec({ type: "FETCH_OK", data });
//       } catch (e) {
//         if (!cancelled) dispatchRec({ type: "FETCH_ERR", message: e instanceof Error ? e.message : "Failed to load record." });
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [selectedId]);

//   async function submitReview(action: "approve" | "reject") {
//     if (!selectedId || actionState !== "idle") return;
//     if (action === "reject" && !remarks.trim()) return;
//     dispatchRec({ type: "ACTION_START", action });
//     try {
//       const res = await fetch(`/api/registrations/${selectedId}/admin-review`, {
//         method: "PATCH", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action, adminId: session?.id, remarks }),
//       });
//       if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Unknown error"); }
//       dispatchQueue({ type: "LOADED", items: queue.filter(x => x.id !== selectedId) });
//       dispatchRec({ type: "ACTION_OK", action });
//     } catch (e) {
//       dispatchRec({ type: "ACTION_ERR", message: e instanceof Error ? e.message : "An unexpected error occurred." });
//     }
//   }

//   const regionMeta = session ? REGION_META[session.region] : null;

//   return (
//     <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

//       <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

//         {/* ── Sidebar ── */}
//         <aside style={{ width: 300, background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>

//           {/* Admin identity — matches coordinator banner style */}
//           <div style={{
//             background: regionMeta?.bg ?? "#f8fafc",
//             borderBottom: `2px solid ${regionMeta?.border ?? "#e2e8f0"}`,
//             padding: "14px 18px",
//             display: "flex", alignItems: "center", gap: 12,
//           }}>
//             {sessionLoading ? (
//               <div style={{ height: 48, background: "#f1f5f9", borderRadius: 10, flex: 1 }} />
//             ) : session && regionMeta ? (
//               <>
//                 <div style={{ width: 40, height: 40, borderRadius: 11, background: regionMeta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                   <span style={{ fontSize: 11, fontWeight: 800, color: "white", fontFamily: "'DM Mono', monospace" }}>{session.region}</span>
//                 </div>
//                 <div>
//                   <p style={{ margin: "0 0 1px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.fullName}</p>
//                   <p style={{ margin: 0, fontSize: 11, color: regionMeta.color, fontWeight: 700 }}>{session.rldc} Admin</p>
//                   <p style={{ margin: "1px 0 0", fontSize: 10, color: "#64748b" }}>{regionMeta.full}</p>
//                 </div>
//               </>
//             ) : (
//               <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 14px", flex: 1 }}>
//                 <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#dc2626" }}>Session Error</p>
//                 <p style={{ margin: 0, fontSize: 11, color: "#7f1d1d", lineHeight: 1.5 }}>Unable to load admin session. Please refresh or log in again.</p>
//               </div>
//             )}
//           </div>

//           {/* Tab bar */}
//           <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
//             {([
//               { key: "requests" as SidebarTab, label: "Requests" },
//               { key: "create-coordinator" as SidebarTab, label: "Add Coord." },
//             ]).map(t => {
//               const active = tab === t.key;
//               return (
//                 <button key={t.key} onClick={() => setTab(t.key)} style={{
//                   flex: 1, padding: "11px 8px", border: "none", borderBottom: `2.5px solid ${active ? "#1D4ED8" : "transparent"}`,
//                   background: active ? "white" : "transparent", cursor: "pointer",
//                   fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" as const,
//                   color: active ? "#1D4ED8" : "#94a3b8", fontFamily: "'DM Sans', sans-serif",
//                   display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//                 }}>
//                   {t.label}
//                   {t.key === "requests" && !queueLoading && queue.length > 0 && (
//                     <span style={{ background: "#1D4ED8", color: "white", fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 99, lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>
//                       {queue.length}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Tab content */}
//           {tab === "requests" ? (
//             <>
//               <div style={{ padding: "12px 18px 8px", borderBottom: "1px solid #f1f5f9" }}>
//                 <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Approval Queue</p>
//                 {!queueLoading && !queueError && (
//                   <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
//                     Registrations
//                     {queue.length > 0 && (
//                       <span style={{ marginLeft: 8, background: "#1D4ED8", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, fontFamily: "'DM Mono', monospace", verticalAlign: "middle" }}>
//                         {queue.length}
//                       </span>
//                     )}
//                   </h2>
//                 )}
//               </div>
//               <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
//                 {queueLoading
//                   ? [1, 2, 3].map(i => <div key={i} style={{ height: 80, background: "#f1f5f9", borderRadius: 10, marginBottom: 6 }} />)
//                   : queueError
//                     ? <div style={{ padding: "32px 12px", textAlign: "center" }}><p style={{ fontSize: 12, color: "#f87171" }}>{queueError}</p></div>
//                     : queue.length === 0
//                       ? (
//                         <div style={{ padding: "48px 12px", textAlign: "center" }}>
//                           <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: "0 0 4px" }}>All caught up</p>
//                           <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No pending requests</p>
//                         </div>
//                       )
//                       : queue.map(req => {
//                           const active = selectedId === req.id;
//                           return (
//                             <button
//                               key={req.id}
//                               onClick={() => dispatchQueue({ type: "SELECT", id: req.id })}
//                               style={{
//                                 width: "100%", textAlign: "left", padding: "11px 13px", borderRadius: 10, marginBottom: 5, cursor: "pointer",
//                                 border: `1.5px solid ${active ? "#bfdbfe" : "#f1f5f9"}`,
//                                 background: active ? "#EFF6FF" : "white",
//                                 fontFamily: "'DM Sans', sans-serif", transition: "all .15s",
//                               }}
//                             >
//                               {/* ── Registration number — top, prominent ── */}
//                               <p style={{
//                                 margin: "0 0 4px",
//                                 fontSize: 11,
//                                 fontFamily: "'DM Mono', monospace",
//                                 fontWeight: 700,
//                                 color: active ? "#1D4ED8" : "#64748b",
//                                 letterSpacing: "0.04em",
//                               }}>
//                                 {req.regNumber}
//                               </p>

//                               {/* ── Applicant name ── */}
//                               <p style={{ margin: "0 0 7px", fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>
//                                 {req.applicantName}
//                               </p>

//                               {/* ── Badges row ── */}
//                               <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                                 <span style={{
//                                   fontSize: 10,
//                                   background: active ? "#1D4ED8" : "#f1f5f9",
//                                   color: active ? "white" : "#64748b",
//                                   padding: "2px 7px", borderRadius: 5, fontWeight: 700,
//                                   textTransform: "uppercase" as const,
//                                 }}>
//                                   {req.registrationType.charAt(0) + req.registrationType.slice(1).toLowerCase()}
//                                 </span>
//                                 <span style={{ fontSize: 10, color: "#94a3b8" }}>
//                                   {relativeTime(req.coordinatorApprovedAt)}
//                                 </span>
//                               </div>
//                             </button>
//                           );
//                         })}
//               </div>
//               <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", alignItems: "center", gap: 7 }}>
//                 <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
//                 <span style={{ fontSize: 10, color: "#94a3b8" }}>Coordinator-approved only</span>
//               </div>
//             </>
//           ) : session ? <CreateCoordinatorPanel session={session} /> : (
//             <div style={{ padding: 24, textAlign: "center" }}><p style={{ fontSize: 12, color: "#94a3b8" }}>Loading session…</p></div>
//           )}
//         </aside>

//         {/* ── Main Content ── */}
//         <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
//           <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

//             {/* Page title */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div>
//                 <p style={{ margin: "0 0 4px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8" }}>RLDC Admin</p>
//                 <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>Registration Approvals</h1>
//               </div>
//               {session && regionMeta && (
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, background: regionMeta.bg, border: `1.5px solid ${regionMeta.border}`, borderRadius: 10, padding: "7px 14px" }}>
//                   <span style={{ width: 8, height: 8, borderRadius: "50%", background: regionMeta.color, display: "inline-block" }} />
//                   <span style={{ fontSize: 12, fontWeight: 700, color: regionMeta.color, fontFamily: "'DM Mono', monospace" }}>{session.rldc}</span>
//                   <span style={{ fontSize: 11, color: "#64748b" }}>— {regionMeta.full}</span>
//                 </div>
//               )}
//             </div>

//             {/* Progress Bar — step 2 */}
//             <div className="border-t border-slate-100 pt-4">
//               <ProgressBar currentStep={2} />
//             </div>

//             {/* Action result banners */}
//             {actionState === "done-approve" && (
//               <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
//                 <span style={{ fontSize: 20 }}>✅</span>
//                 <div>
//                   <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#15803d" }}>Request Approved</p>
//                   <p style={{ margin: 0, fontSize: 11, color: "#16a34a" }}>Activation email and OTP dispatched. Select another request from the queue.</p>
//                 </div>
//               </div>
//             )}
//             {actionState === "done-reject" && (
//               <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
//                 <span style={{ fontSize: 20 }}>❌</span>
//                 <div>
//                   <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Request Rejected</p>
//                   <p style={{ margin: 0, fontSize: 11, color: "#ef4444" }}>The applicant has been notified. Select another request from the queue.</p>
//                 </div>
//               </div>
//             )}
//             {actionState === "error" && actionError && (
//               <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
//                 <span style={{ fontSize: 20 }}>⚠️</span>
//                 <div>
//                   <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#92400e" }}>Action Failed</p>
//                   <p style={{ margin: 0, fontSize: 11, color: "#b45309" }}>{actionError}</p>
//                 </div>
//               </div>
//             )}

//             {/* Empty state */}
//             {!selectedId && !actionState.startsWith("done") && (
//               <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", padding: "80px 24px", textAlign: "center" }}>
//                 <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
//                   <svg width="26" height="26" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                   </svg>
//                 </div>
//                 <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#475569" }}>No request selected</p>
//                 <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Select a coordinator-approved request from the <strong>Requests</strong> tab to begin review.</p>
//               </div>
//             )}

//             {/* Record card */}
//             {selectedId && (
//               <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>

//                 {/* Card header */}
//                 <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc" }}>
//                   <div>
//                     <h2 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Final Approval — RLDC Admin</h2>
//                     <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>Review the coordinator-forwarded request and grant or reject final approval.</p>
//                   </div>
//                   <span style={{ fontSize: 10, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", padding: "4px 11px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, fontFamily: "'DM Mono', monospace" }}>
//                     Step 3 / 4
//                   </span>
//                 </div>

//                 {/* Skeleton */}
//                 {recordLoading && (
//                   <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
//                     {[100, 72, 88].map((h, i) => <div key={i} style={{ height: h, background: "#f1f5f9", borderRadius: 10 }} />)}
//                   </div>
//                 )}

//                 {recordError && (
//                   <div style={{ padding: "48px 24px", textAlign: "center" }}>
//                     <p style={{ fontSize: 13, color: "#f87171" }}>{recordError}</p>
//                   </div>
//                 )}

//                 {!recordLoading && !recordError && record && (
//                   <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>

//                     {/* Summary grid */}
//                     <section>
//                       <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Request Summary</p>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #f1f5f9", borderRadius: 11, overflow: "hidden" }}>
//                         {[
//                           { label: "Applicant",         value: record.applicantName,           type: "text" },
//                           { label: "Status",            value: "Coordinator Approved",         type: "green" },
//                           { label: "Entity Name",       value: record.entityName,              type: "text" },
//                           { label: "Entity Type",       value: record.entityType,              type: "text" },
//                           { label: "Registration Type", value: fmt(record.registrationType),   type: "blue" },
//                           { label: "Assigned Role",     value: fmt(record.assignedRole),       type: "blue" },
//                           { label: "Submitted",         value: fmtDate(record.submittedAt),    type: "mono" },
//                           { label: "Coord. Approved",   value: fmtDate(record.coordinatorApprovedAt), type: "mono" },
//                         ].map((c, i) => (
//                           <div key={i} style={{ padding: "12px 16px", background: i % 4 < 2 ? "#fafbfc" : "white", borderBottom: i < 6 ? "1px solid #f1f5f9" : "none", borderRight: i % 2 === 0 ? "1px solid #f1f5f9" : "none" }}>
//                             <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{c.label}</p>
//                             {c.type === "text" && <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{c.value}</p>}
//                             {c.type === "mono" && <p style={{ margin: 0, fontSize: 11.5, fontFamily: "'DM Mono', monospace", color: "#475569" }}>{c.value}</p>}
//                             {c.type === "green" && <span style={{ fontSize: 10.5, background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac", padding: "2px 9px", borderRadius: 5, fontWeight: 700 }}>{c.value}</span>}
//                             {c.type === "blue" && <span style={{ fontSize: 10.5, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "2px 9px", borderRadius: 5, fontWeight: 700 }}>{c.value}</span>}
//                           </div>
//                         ))}
//                       </div>
//                     </section>

//                     {/* Coordinator review */}
//                     <section style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "16px 18px" }}>
//                       <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#92400e" }}>Coordinator Review</p>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
//                         <div>
//                           <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Reviewed By</p>
//                           <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{record.coordinator?.name ?? "—"}</p>
//                           {record.coordinator?.email && <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{record.coordinator.email}</p>}
//                         </div>
//                         <div>
//                           <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Reviewed At</p>
//                           <p style={{ margin: 0, fontSize: 11.5, fontFamily: "'DM Mono', monospace", color: "#475569" }}>{fmtDate(record.coordinatorApprovedAt)}</p>
//                         </div>
//                       </div>
//                       <div>
//                         <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Remarks</p>
//                         <p style={{ margin: 0, fontSize: 12, color: "#475569", fontStyle: "italic", lineHeight: 1.55 }}>
//                           {record.coordinatorRemarks ? `"${record.coordinatorRemarks}"` : "No remarks provided."}
//                         </p>
//                       </div>
//                     </section>

//                     {/* Documents */}
//                     {record.documents.length > 0 && (
//                       <section>
//                         <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Submitted Documents</p>
//                         <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                           {record.documents.map(doc => (
//                             <span key={doc} style={{ fontSize: 11.5, background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
//                               <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
//                               {doc}
//                             </span>
//                           ))}
//                         </div>
//                       </section>
//                     )}

//                     {/* On-approval triggers */}
//                     <section>
//                       <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>On Approval — Both Triggered Simultaneously</p>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                         <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 16px" }}>
//                           <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#1e3a8a" }}>📧 Activation Email</p>
//                           <p style={{ margin: "0 0 6px", fontSize: 11, color: "#2563eb", fontWeight: 600 }}>To: {record.applicantEmail}</p>
//                           <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.5 }}>A secure, time-bound link (48 hrs) will be sent.</p>
//                         </div>
//                         <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 16px" }}>
//                           <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#14532d" }}>📱 OTP to Mobile</p>
//                           <p style={{ margin: "0 0 6px", fontSize: 11, color: "#16a34a", fontWeight: 600 }}>To: {record.applicantPhone}</p>
//                           <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.5 }}>A 6-digit OTP will be sent to the registered mobile.</p>
//                         </div>
//                       </div>
//                     </section>

//                     {/* Admin remarks + actions */}
//                     <section style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
//                       <div style={{ marginBottom: 14 }}>
//                         <label style={{ ...labelStyle, marginBottom: 7 }}>
//                           Admin Remarks <span style={{ fontWeight: 400, color: "#94a3b8" }}>(required when rejecting)</span>
//                         </label>
//                         <textarea
//                           value={remarks}
//                           onChange={e => dispatchRec({ type: "SET_REMARKS", value: e.target.value })}
//                           placeholder="Enter your remarks or reason for rejection…"
//                           disabled={actionState !== "idle"}
//                           rows={3}
//                           style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#0f172a", background: actionState !== "idle" ? "#f8fafc" : "white", outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "none", lineHeight: 1.6, opacity: actionState !== "idle" ? 0.6 : 1, boxSizing: "border-box" as const }}
//                         />
//                       </div>

//                       <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
//                         {!remarks.trim() && actionState === "idle" && (
//                           <p style={{ margin: 0, fontSize: 10.5, color: "#94a3b8" }}>← Add a remark to enable rejection</p>
//                         )}
//                         <button
//                           onClick={() => submitReview("reject")}
//                           disabled={!remarks.trim() || actionState !== "idle"}
//                           style={{ padding: "9px 20px", border: "1.5px solid #e2e8f0", borderRadius: 9, background: "white", color: "#475569", fontSize: 13, fontWeight: 700, cursor: (!remarks.trim() || actionState !== "idle") ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: (!remarks.trim() || actionState !== "idle") ? 0.4 : 1 }}>
//                           {actionState === "rejecting" ? "Rejecting…" : "Reject"}
//                         </button>
//                         <button
//                           onClick={() => submitReview("approve")}
//                           disabled={actionState !== "idle"}
//                           style={{ padding: "9px 22px", background: actionState !== "idle" ? "#475569" : "#1D4ED8", border: "none", borderRadius: 9, color: "white", fontSize: 13, fontWeight: 700, cursor: actionState !== "idle" ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 7, boxShadow: actionState === "idle" ? "0 2px 8px rgba(29,78,216,0.25)" : "none" }}>
//                           {actionState === "approving" ? "Approving…" : (
//                             <>
//                               Grant Final Approval
//                               <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </section>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useReducer } from "react";
import ProgressBar from "@/components/ProgressBar";

// ─── Types ────────────────────────────────────────────────────────────────────

type Region = "NR" | "WR" | "SR" | "ER" | "NER";

interface AdminSession {
  id: string; fullName: string; email: string; region: Region; rldc: string;
}
interface QueueItem {
  id: string; regNumber: string; applicantName: string;
  registrationType: string; coordinatorApprovedAt: string;
}
interface RegistrationRecord {
  id: string; regNumber: string; applicantName: string;
  applicantEmail: string; applicantPhone: string;
  registrationType: string; entityName: string; entityType: string;
  assignedRole: string; documents: string[];
  coordinator: { id: string; name: string; email: string } | null;
  coordinatorRemarks: string | null; coordinatorApprovedAt: string | null; submittedAt: string;
}
type SidebarTab = "requests" | "create-coordinator";
type ActionState = "idle" | "approving" | "rejecting" | "done-approve" | "done-reject" | "error";

// ─── Region metadata ──────────────────────────────────────────────────────────

const REGION_META: Record<Region, { label: string; full: string; color: string; bg: string; border: string }> = {
  NR:  { label: "NR",  full: "Northern Region",      color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  WR:  { label: "WR",  full: "Western Region",       color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  SR:  { label: "SR",  full: "Southern Region",      color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
  ER:  { label: "ER",  full: "Eastern Region",       color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  NER: { label: "NER", full: "North-Eastern Region", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
};

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
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmt(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Create Coordinator Panel ─────────────────────────────────────────────────

interface CoordForm {
  fullName: string; username: string; password: string;
  email: string; altEmail: string; phone: string; altPhone: string; designation: string;
}
const EMPTY: CoordForm = { fullName: "", username: "", password: "", email: "", altEmail: "", phone: "", altPhone: "", designation: "RLDC Coordinator" };

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5, fontFamily: "'DM Sans', sans-serif" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#0f172a", background: "#f8fafc", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" as const };

function CreateCoordinatorPanel({ session }: { session: AdminSession }) {
  const meta = REGION_META[session.region];
  const [form, setForm] = useState<CoordForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  function field(k: keyof CoordForm, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    setError("");
    if (!form.fullName || !form.username || !form.password || !form.email || !form.phone) {
      setError("Please fill all required fields."); return;
    }
    setSubmitting(true);
    try {
      // ✅ adminId sent so the route can lock region to admin's entity.rldc
      const res = await fetch("/api/admin/coordinators", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, adminId: session.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Coordinator "${form.fullName}" created for ${meta.full}.`);
        setForm(EMPTY);
        setTimeout(() => setSuccess(""), 7000);
      } else { setError(data.message || "Failed to create coordinator."); }
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  }

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ background: meta.bg, borderBottom: `2px solid ${meta.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: meta.color, margin: "0 0 2px", fontFamily: "'DM Sans', sans-serif" }}>Region-Locked</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{session.rldc} — {meta.full}</p>
          <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0", fontFamily: "'DM Sans', sans-serif" }}>Coordinators assigned to {meta.label} only</p>
        </div>
      </div>

      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 9, padding: "10px 13px", fontSize: 12, color: "#15803d", display: "flex", gap: 8, alignItems: "center", fontFamily: "'DM Sans', sans-serif" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            {success}
          </div>
        )}
        {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 9, padding: "10px 13px", fontSize: 12, color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>{error}</div>}

        <div>
          <label style={labelStyle}>RLDC Zone <span style={{ fontWeight: 400, color: "#94a3b8" }}>(auto-assigned)</span></label>
          <div style={{ ...inputStyle, background: meta.bg, border: `1.5px solid ${meta.border}`, color: meta.color, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, cursor: "not-allowed" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
            {session.rldc} — {meta.full}
            <svg width="12" height="12" fill="none" stroke={meta.color} strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: "auto", opacity: 0.6 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Full Name *</label>
          <input style={inputStyle} placeholder="e.g. Priya Verma" value={form.fullName} onChange={e => field("fullName", e.target.value)} disabled={submitting} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Username *</label>
            <input style={inputStyle} placeholder="coord_nr_01" value={form.username} onChange={e => field("username", e.target.value)} disabled={submitting} />
          </div>
          <div>
            <label style={labelStyle}>Password *</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} style={{ ...inputStyle, paddingRight: 36 }} placeholder="••••••••" value={form.password} onChange={e => field("password", e.target.value)} disabled={submitting} />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
          <input type="email" style={inputStyle} placeholder="name@rldc.gov.in" value={form.email} onChange={e => field("email", e.target.value)} disabled={submitting} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Phone *</label>
            <input style={inputStyle} placeholder="9876543210" value={form.phone} onChange={e => field("phone", e.target.value)} disabled={submitting} />
          </div>
          <div>
            <label style={labelStyle}>Designation</label>
            <input style={inputStyle} value={form.designation} onChange={e => field("designation", e.target.value)} disabled={submitting} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Alternate Email <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
          <input type="email" style={inputStyle} placeholder="alt@rldc.gov.in" value={form.altEmail} onChange={e => field("altEmail", e.target.value)} disabled={submitting} />
        </div>

        <div>
          <label style={labelStyle}>Alternate Phone <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
          <input style={inputStyle} placeholder="9876543210" value={form.altPhone} onChange={e => field("altPhone", e.target.value)} disabled={submitting} />
        </div>

        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 9, padding: "10px 13px", fontSize: 11.5, color: "#0369a1", lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>
          <strong>On creation:</strong> Account activates immediately and is scoped to <strong>{meta.full}</strong> only.
        </div>

        <button onClick={submit} disabled={submitting}
          style={{ width: "100%", padding: "11px 0", background: submitting ? "#64748b" : "#0f172a", border: "none", borderRadius: 9, color: "white", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em" }}>
          {submitting ? "Creating…" : `Create ${meta.label} Coordinator ↗`}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminApprovalPage() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [tab, setTab] = useState<SidebarTab>("requests");

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

  // ── Queue reducer ──
  type QueueState = { items: QueueItem[]; selectedId: string | null; loading: boolean; error: string | null; };
  type QueueAction = { type: "LOADED"; items: QueueItem[] } | { type: "ERROR"; message: string } | { type: "SELECT"; id: string | null };

  function queueReducer(s: QueueState, a: QueueAction): QueueState {
    switch (a.type) {
      case "LOADED": return { items: a.items, selectedId: a.items[0]?.id ?? null, loading: false, error: null };
      case "ERROR":  return { ...s, loading: false, error: a.message };
      case "SELECT": return { ...s, selectedId: a.id };
    }
  }
  const [queueState, dispatchQueue] = useReducer(queueReducer, { items: [], selectedId: null, loading: true, error: null });
  const { items: queue, selectedId, loading: queueLoading, error: queueError } = queueState;

  // ── Record reducer ──
  type RecordState = { data: RegistrationRecord | null; loading: boolean; error: string | null; remarks: string; actionState: ActionState; actionError: string | null; };
  type RecordAction =
    | { type: "FETCH_START" } | { type: "FETCH_OK"; data: RegistrationRecord } | { type: "FETCH_ERR"; message: string }
    | { type: "SET_REMARKS"; value: string }
    | { type: "ACTION_START"; action: "approve" | "reject" } | { type: "ACTION_OK"; action: "approve" | "reject" } | { type: "ACTION_ERR"; message: string };

  function recordReducer(s: RecordState, a: RecordAction): RecordState {
    switch (a.type) {
      case "FETCH_START": return { data: null, loading: true, error: null, remarks: "", actionState: "idle", actionError: null };
      case "FETCH_OK":    return { ...s, data: a.data, loading: false };
      case "FETCH_ERR":   return { ...s, error: a.message, loading: false };
      case "SET_REMARKS": return { ...s, remarks: a.value };
      case "ACTION_START": return { ...s, actionState: a.action === "approve" ? "approving" : "rejecting", actionError: null };
      case "ACTION_OK":    return { ...s, actionState: a.action === "approve" ? "done-approve" : "done-reject" };
      case "ACTION_ERR":   return { ...s, actionState: "error", actionError: a.message };
    }
  }
  const [recState, dispatchRec] = useReducer(recordReducer, { data: null, loading: false, error: null, remarks: "", actionState: "idle", actionError: null });
  const { data: record, loading: recordLoading, error: recordError, remarks, actionState, actionError } = recState;

  // ── Load queue — no ?region= param; API resolves RLDC from session cookie ──
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    (async () => {
      try {
        // ✅ No query param — route reads admin's RLDC from the session cookie server-side
        const res = await fetch("/api/registrations/coordinator-approved");
        if (!res.ok) throw new Error("Failed to load queue");
        const items = await res.json() as QueueItem[];
        if (!cancelled) dispatchQueue({ type: "LOADED", items });
      } catch (e) {
        if (!cancelled) dispatchQueue({ type: "ERROR", message: e instanceof Error ? e.message : "Failed to load queue." });
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  useEffect(() => {
    if (!selectedId) return;
    dispatchRec({ type: "FETCH_START" });
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/registrations/${selectedId}`);
        if (!res.ok) throw new Error("Failed to load record");
        const data = await res.json() as RegistrationRecord;
        if (!cancelled) dispatchRec({ type: "FETCH_OK", data });
      } catch (e) {
        if (!cancelled) dispatchRec({ type: "FETCH_ERR", message: e instanceof Error ? e.message : "Failed to load record." });
      }
    })();
    return () => { cancelled = true; };
  }, [selectedId]);

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
      dispatchQueue({ type: "LOADED", items: queue.filter(x => x.id !== selectedId) });
      dispatchRec({ type: "ACTION_OK", action });
    } catch (e) {
      dispatchRec({ type: "ACTION_ERR", message: e instanceof Error ? e.message : "An unexpected error occurred." });
    }
  }

  const regionMeta = session ? REGION_META[session.region] : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 300, background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>

          <div style={{ background: regionMeta?.bg ?? "#f8fafc", borderBottom: `2px solid ${regionMeta?.border ?? "#e2e8f0"}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            {sessionLoading ? (
              <div style={{ height: 48, background: "#f1f5f9", borderRadius: 10, flex: 1 }} />
            ) : session && regionMeta ? (
              <>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: regionMeta.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "white", fontFamily: "'DM Mono', monospace" }}>{session.region}</span>
                </div>
                <div>
                  <p style={{ margin: "0 0 1px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.fullName}</p>
                  <p style={{ margin: 0, fontSize: 11, color: regionMeta.color, fontWeight: 700 }}>{session.rldc} Admin</p>
                  <p style={{ margin: "1px 0 0", fontSize: 10, color: "#64748b" }}>{regionMeta.full}</p>
                </div>
              </>
            ) : (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 14px", flex: 1 }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "#dc2626" }}>Session Error</p>
                <p style={{ margin: 0, fontSize: 11, color: "#7f1d1d", lineHeight: 1.5 }}>Unable to load admin session. Please refresh or log in again.</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
            {([
              { key: "requests" as SidebarTab, label: "Requests" },
              { key: "create-coordinator" as SidebarTab, label: "Add Coord." },
            ]).map(t => {
              const active = tab === t.key;
              return (
                <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: "11px 8px", border: "none", borderBottom: `2.5px solid ${active ? "#1D4ED8" : "transparent"}`, background: active ? "white" : "transparent", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" as const, color: active ? "#1D4ED8" : "#94a3b8", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {t.label}
                  {t.key === "requests" && !queueLoading && queue.length > 0 && (
                    <span style={{ background: "#1D4ED8", color: "white", fontSize: 9, fontWeight: 800, padding: "1px 6px", borderRadius: 99, lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>{queue.length}</span>
                  )}
                </button>
              );
            })}
          </div>

          {tab === "requests" ? (
            <>
              <div style={{ padding: "12px 18px 8px", borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Approval Queue</p>
                {!queueLoading && !queueError && (
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    Registrations
                    {queue.length > 0 && <span style={{ marginLeft: 8, background: "#1D4ED8", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, fontFamily: "'DM Mono', monospace", verticalAlign: "middle" }}>{queue.length}</span>}
                  </h2>
                )}
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
                {queueLoading
                  ? [1, 2, 3].map(i => <div key={i} style={{ height: 80, background: "#f1f5f9", borderRadius: 10, marginBottom: 6 }} />)
                  : queueError
                    ? <div style={{ padding: "32px 12px", textAlign: "center" }}><p style={{ fontSize: 12, color: "#f87171" }}>{queueError}</p></div>
                    : queue.length === 0
                      ? <div style={{ padding: "48px 12px", textAlign: "center" }}><p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: "0 0 4px" }}>All caught up</p><p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No pending requests</p></div>
                      : queue.map(req => {
                          const active = selectedId === req.id;
                          return (
                            <button key={req.id} onClick={() => dispatchQueue({ type: "SELECT", id: req.id })}
                              style={{ width: "100%", textAlign: "left", padding: "11px 13px", borderRadius: 10, marginBottom: 5, cursor: "pointer", border: `1.5px solid ${active ? "#bfdbfe" : "#f1f5f9"}`, background: active ? "#EFF6FF" : "white", fontFamily: "'DM Sans', sans-serif", transition: "all .15s" }}>
                              <p style={{ margin: "0 0 4px", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: active ? "#1D4ED8" : "#64748b", letterSpacing: "0.04em" }}>{req.regNumber}</p>
                              <p style={{ margin: "0 0 7px", fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>{req.applicantName}</p>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 10, background: active ? "#1D4ED8" : "#f1f5f9", color: active ? "white" : "#64748b", padding: "2px 7px", borderRadius: 5, fontWeight: 700, textTransform: "uppercase" as const }}>
                                  {req.registrationType.charAt(0) + req.registrationType.slice(1).toLowerCase()}
                                </span>
                                <span style={{ fontSize: 10, color: "#94a3b8" }}>{relativeTime(req.coordinatorApprovedAt)}</span>
                              </div>
                            </button>
                          );
                        })}
              </div>
              <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                <span style={{ fontSize: 10, color: "#94a3b8" }}>Coordinator-approved only</span>
              </div>
            </>
          ) : session ? <CreateCoordinatorPanel session={session} /> : (
            <div style={{ padding: 24, textAlign: "center" }}><p style={{ fontSize: 12, color: "#94a3b8" }}>Loading session…</p></div>
          )}
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8" }}>RLDC Admin</p>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>Registration Approvals</h1>
              </div>
              {session && regionMeta && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: regionMeta.bg, border: `1.5px solid ${regionMeta.border}`, borderRadius: 10, padding: "7px 14px" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: regionMeta.color, display: "inline-block" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: regionMeta.color, fontFamily: "'DM Mono', monospace" }}>{session.rldc}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>— {regionMeta.full}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <ProgressBar currentStep={2} />
            </div>

            {actionState === "done-approve" && (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#15803d" }}>Request Approved</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#16a34a" }}>Activation email and OTP dispatched. Select another request from the queue.</p>
                </div>
              </div>
            )}
            {actionState === "done-reject" && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>❌</span>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Request Rejected</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#ef4444" }}>The applicant has been notified. Select another request from the queue.</p>
                </div>
              </div>
            )}
            {actionState === "error" && actionError && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#92400e" }}>Action Failed</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#b45309" }}>{actionError}</p>
                </div>
              </div>
            )}

            {!selectedId && !actionState.startsWith("done") && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", padding: "80px 24px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <svg width="26" height="26" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#475569" }}>No request selected</p>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Select a coordinator-approved request from the <strong>Requests</strong> tab to begin review.</p>
              </div>
            )}

            {selectedId && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc" }}>
                  <div>
                    <h2 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Final Approval — RLDC Admin</h2>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>Review the coordinator-forwarded request and grant or reject final approval.</p>
                  </div>
                  <span style={{ fontSize: 10, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", padding: "4px 11px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, fontFamily: "'DM Mono', monospace" }}>Step 3 / 4</span>
                </div>

                {recordLoading && (
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    {[100, 72, 88].map((h, i) => <div key={i} style={{ height: h, background: "#f1f5f9", borderRadius: 10 }} />)}
                  </div>
                )}
                {recordError && <div style={{ padding: "48px 24px", textAlign: "center" }}><p style={{ fontSize: 13, color: "#f87171" }}>{recordError}</p></div>}

                {!recordLoading && !recordError && record && (
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
                    <section>
                      <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Request Summary</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #f1f5f9", borderRadius: 11, overflow: "hidden" }}>
                        {[
                          { label: "Applicant",         value: record.applicantName,           type: "text" },
                          { label: "Status",            value: "Coordinator Approved",         type: "green" },
                          { label: "Entity Name",       value: record.entityName,              type: "text" },
                          { label: "Entity Type",       value: record.entityType,              type: "text" },
                          { label: "Registration Type", value: fmt(record.registrationType),   type: "blue" },
                          { label: "Assigned Role",     value: fmt(record.assignedRole),       type: "blue" },
                          { label: "Submitted",         value: fmtDate(record.submittedAt),    type: "mono" },
                          { label: "Coord. Approved",   value: fmtDate(record.coordinatorApprovedAt), type: "mono" },
                        ].map((c, i) => (
                          <div key={i} style={{ padding: "12px 16px", background: i % 4 < 2 ? "#fafbfc" : "white", borderBottom: i < 6 ? "1px solid #f1f5f9" : "none", borderRight: i % 2 === 0 ? "1px solid #f1f5f9" : "none" }}>
                            <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{c.label}</p>
                            {c.type === "text" && <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{c.value}</p>}
                            {c.type === "mono" && <p style={{ margin: 0, fontSize: 11.5, fontFamily: "'DM Mono', monospace", color: "#475569" }}>{c.value}</p>}
                            {c.type === "green" && <span style={{ fontSize: 10.5, background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac", padding: "2px 9px", borderRadius: 5, fontWeight: 700 }}>{c.value}</span>}
                            {c.type === "blue" && <span style={{ fontSize: 10.5, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "2px 9px", borderRadius: 5, fontWeight: 700 }}>{c.value}</span>}
                          </div>
                        ))}
                      </div>
                    </section>

                    <section style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "16px 18px" }}>
                      <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#92400e" }}>Coordinator Review</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 12 }}>
                        <div>
                          <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Reviewed By</p>
                          <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{record.coordinator?.name ?? "—"}</p>
                          {record.coordinator?.email && <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{record.coordinator.email}</p>}
                        </div>
                        <div>
                          <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Reviewed At</p>
                          <p style={{ margin: 0, fontSize: 11.5, fontFamily: "'DM Mono', monospace", color: "#475569" }}>{fmtDate(record.coordinatorApprovedAt)}</p>
                        </div>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Remarks</p>
                        <p style={{ margin: 0, fontSize: 12, color: "#475569", fontStyle: "italic", lineHeight: 1.55 }}>
                          {record.coordinatorRemarks ? `"${record.coordinatorRemarks}"` : "No remarks provided."}
                        </p>
                      </div>
                    </section>

                    {record.documents.length > 0 && (
                      <section>
                        <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Submitted Documents</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {record.documents.map(doc => (
                            <span key={doc} style={{ fontSize: 11.5, background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: 8, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                              <svg width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                              {doc}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    <section>
                      <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>On Approval — Both Triggered Simultaneously</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 16px" }}>
                          <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#1e3a8a" }}>📧 Activation Email</p>
                          <p style={{ margin: "0 0 6px", fontSize: 11, color: "#2563eb", fontWeight: 600 }}>To: {record.applicantEmail}</p>
                          <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.5 }}>A secure, time-bound link (48 hrs) will be sent.</p>
                        </div>
                        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 16px" }}>
                          <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#14532d" }}>📱 OTP to Mobile</p>
                          <p style={{ margin: "0 0 6px", fontSize: 11, color: "#16a34a", fontWeight: 600 }}>To: {record.applicantPhone}</p>
                          <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.5 }}>A 6-digit OTP will be sent to the registered mobile.</p>
                        </div>
                      </div>
                    </section>

                    <section style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ ...labelStyle, marginBottom: 7 }}>
                          Admin Remarks <span style={{ fontWeight: 400, color: "#94a3b8" }}>(required when rejecting)</span>
                        </label>
                        <textarea
                          value={remarks}
                          onChange={e => dispatchRec({ type: "SET_REMARKS", value: e.target.value })}
                          placeholder="Enter your remarks or reason for rejection…"
                          disabled={actionState !== "idle"}
                          rows={3}
                          style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#0f172a", background: actionState !== "idle" ? "#f8fafc" : "white", outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "none", lineHeight: 1.6, opacity: actionState !== "idle" ? 0.6 : 1, boxSizing: "border-box" as const }}
                        />
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
                        {!remarks.trim() && actionState === "idle" && (
                          <p style={{ margin: 0, fontSize: 10.5, color: "#94a3b8" }}>← Add a remark to enable rejection</p>
                        )}
                        <button onClick={() => submitReview("reject")} disabled={!remarks.trim() || actionState !== "idle"}
                          style={{ padding: "9px 20px", border: "1.5px solid #e2e8f0", borderRadius: 9, background: "white", color: "#475569", fontSize: 13, fontWeight: 700, cursor: (!remarks.trim() || actionState !== "idle") ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: (!remarks.trim() || actionState !== "idle") ? 0.4 : 1 }}>
                          {actionState === "rejecting" ? "Rejecting…" : "Reject"}
                        </button>
                        <button onClick={() => submitReview("approve")} disabled={actionState !== "idle"}
                          style={{ padding: "9px 22px", background: actionState !== "idle" ? "#475569" : "#1D4ED8", border: "none", borderRadius: 9, color: "white", fontSize: 13, fontWeight: 700, cursor: actionState !== "idle" ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 7, boxShadow: actionState === "idle" ? "0 2px 8px rgba(29,78,216,0.25)" : "none" }}>
                          {actionState === "approving" ? "Approving…" : (<>Grant Final Approval <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg></>)}
                        </button>
                      </div>
                    </section>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}