

// "use client";

// import { useState, useEffect } from "react";
// import ProgressBar from "@/components/ProgressBar";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface CoordinatorSession {
//   id: string;
//   fullName: string;
//   email: string;
//   region: string;
//   rldc: string;
// }
// interface UserProfile {
//   fullName: string; designation: string; email: string;
//   altEmail?: string | null; phone: string; altPhone?: string | null;
// }
// interface UserRole { role: string; }
// interface UserEntity {
//   entityName: string; substation: string;
//   ownerName: string; ownerEmail: string; ownerPhone: string; rldc: string;
// }
// interface UserMeter { id: string; meterNo: string; meterOwner: string; }
// interface UserQCA { licenseNumber: string; managedStations?: string | null; }
// interface UserAssociateManager {
//   id: string; name?: string | null; designation?: string | null;
//   email?: string | null; phone?: string | null;
// }
// interface RequestUser {
//   id: string; username: string; userType: string; regNumber: string; createdAt: string;
//   profile: UserProfile | null; role: UserRole | null; entity: UserEntity | null;
//   meters: UserMeter[]; qcaDetails: UserQCA | null;
//   associateManagers: UserAssociateManager[];
// }

// interface PendingRequest {
//   id: string; userId: string; regNumber: string; approverId: string | null;
//   status: string; remarks: string | null; createdAt: string; user: RequestUser;
// }
// type ActionState = "idle" | "loading" | "success" | "error";

// // ─── Region metadata ──────────────────────────────────────────────────────────

// const RLDC_META: Record<string, { color: string; bg: string; border: string; full: string }> = {
//   NRLDC: { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", full: "Northern Region" },
//   WRLDC: { color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", full: "Western Region" },
//   SRLDC: { color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", full: "Southern Region" },
//   ERLDC: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", full: "Eastern Region" },
//   NERLDC: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", full: "North-Eastern Region" },
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

// const labelStyle: React.CSSProperties = {
//   display: "block", fontSize: 12, fontWeight: 600, color: "#374151",
//   marginBottom: 5, fontFamily: "'DM Sans', sans-serif",
// };
// const inputStyle: React.CSSProperties = {
//   width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0",
//   borderRadius: 9, fontSize: 13, color: "#0f172a", background: "#f8fafc",
//   outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" as const,
// };

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function CoordinatorPage() {
//   const [session, setSession] = useState<CoordinatorSession | null>(null);
//   const [sessionLoading, setSessionLoading] = useState(true);
//   const [requests, setRequests] = useState<PendingRequest[]>([]);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [actionState, setActionState] = useState<ActionState>("idle");
//   const [actionMessage, setActionMessage] = useState("");
//   const [remarks, setRemarks] = useState("");
//   const [formData, setFormData] = useState({ assignedRole: "" });

//   // ── Load session ──
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const res = await fetch("/api/auth/me");
//         if (!res.ok) throw new Error("Session error");
//         const data = await res.json();
//         if (!cancelled) setSession(data.admin ?? null);
//       } catch { if (!cancelled) setSession(null); }
//       finally { if (!cancelled) setSessionLoading(false); }
//     })();
//     return () => { cancelled = true; };
//   }, []);

//   // ── Load requests after session ──
//   useEffect(() => {
//     if (!session) return;
//     let mounted = true;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/coordinator/requests?rldc=${session.rldc}`);
//         if (!res.ok) return;
//         const data = await res.json();
//         if (!mounted) return;
//         const pending: PendingRequest[] = data.pendingRequests ?? [];
//         setRequests(pending);
//         if (pending.length > 0) setSelectedId(pending[0].id);
//       } catch (e) { console.error(e); }
//       finally { if (mounted) setLoading(false); }
//     })();
//     return () => { mounted = false; };
//   }, [session]);

//   const selectedRequest = requests.find(r => r.id === selectedId);
//   const meta = session ? (RLDC_META[session.rldc] ?? RLDC_META["NRLDC"]) : null;

//   const handleForward = async () => {
//     if (!selectedRequest) return;
//     if (!formData.assignedRole) {
//       setActionState("error");
//       setActionMessage("Please assign a role before forwarding.");
//       return;
//     }
//     setActionState("loading"); setActionMessage("");
//     try {
//       const res = await fetch("/api/coordinator/action", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           registrationId: selectedRequest.userId,
//           assignedRole: formData.assignedRole,
//           remarks,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) { setActionState("error"); setActionMessage(data.error || "Something went wrong"); return; }
//       setActionState("success"); setActionMessage(data.message || "Forwarded to Admin successfully");
//       setRemarks(""); setFormData({ assignedRole: "" });
//       const remaining = requests.filter(r => r.id !== selectedId);
//       setRequests(remaining); setSelectedId(remaining[0]?.id ?? null);
//     } catch { setActionState("error"); setActionMessage("Network error. Please try again."); }
//   };

//   const handleReject = async () => {
//     if (!selectedRequest) return;
//     if (!remarks) {
//       setActionState("error");
//       setActionMessage("Remarks are required for rejection.");
//       return;
//     }
//     setActionState("loading"); setActionMessage("");
//     try {
//       const res = await fetch("/api/coordinator/requests", {
//         method: "DELETE", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ registrationId: selectedRequest.userId, remarks }),
//       });
//       const data = await res.json();
//       if (!res.ok) { setActionState("error"); setActionMessage(data.error || "Something went wrong"); return; }
//       setActionState("success"); setActionMessage(data.message || "Request rejected successfully");
//       setRemarks("");
//       const remaining = requests.filter(r => r.id !== selectedId);
//       setRequests(remaining); setSelectedId(remaining[0]?.id ?? null);
//     } catch { setActionState("error"); setActionMessage("Network error. Please try again."); }
//   };

//   if (sessionLoading || loading) {
//     return (
//       <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
//         <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#0f172a", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
//           <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>Loading…</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session) {
//     return (
//       <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
//         <div style={{ background: "white", borderRadius: 14, border: "1px solid #fecaca", padding: "32px 40px", textAlign: "center" }}>
//           <p style={{ fontSize: 14, fontWeight: 700, color: "#dc2626", margin: "0 0 6px" }}>Session Error</p>
//           <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Unable to load session. Please refresh or log in again.</p>
//         </div>
//       </div>
//     );
//   }

//   const u = selectedRequest?.user;

//   return (
//     <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
//       <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

//         {/* ── Sidebar ── */}
//         <aside style={{ width: 300, background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>

//           {/* Identity banner */}
//           <div style={{ background: meta?.bg, borderBottom: `2px solid ${meta?.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 11, background: meta?.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//               <span style={{ fontSize: 11, fontWeight: 800, color: "white", fontFamily: "'DM Mono', monospace" }}>{session.rldc.replace("RLDC", "")}</span>
//             </div>
//             <div>
//               <p style={{ margin: "0 0 1px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{session.fullName}</p>
//               <p style={{ margin: 0, fontSize: 11, color: meta?.color, fontWeight: 700 }}>{session.rldc} Coordinator</p>
//               <p style={{ margin: "1px 0 0", fontSize: 10, color: "#64748b" }}>{meta?.full}</p>
//             </div>
//           </div>

//           <div style={{ padding: "12px 18px 8px", borderBottom: "1px solid #f1f5f9" }}>
//             <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Pending Queue</p>
//             <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
//               Registrations
//               {requests.length > 0 && (
//                 <span style={{ marginLeft: 8, background: "#1D4ED8", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, fontFamily: "'DM Mono', monospace", verticalAlign: "middle" }}>
//                   {requests.length}
//                 </span>
//               )}
//             </h2>
//           </div>

//           <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
//             {requests.length === 0 ? (
//               <div style={{ padding: "48px 12px", textAlign: "center" }}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", margin: "0 0 4px" }}>All caught up</p>
//                 <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No pending requests for {session.rldc}</p>
//               </div>
//             ) : (
//               requests.map(r => {
//                 const active = selectedId === r.id;
//                 return (
//                   <button
//                     key={r.id}
//                     onClick={() => { setSelectedId(r.id); setActionState("idle"); setActionMessage(""); setRemarks(""); setFormData({ assignedRole: "" }); }}
//                     style={{
//                       width: "100%", textAlign: "left", padding: "11px 13px", borderRadius: 10, marginBottom: 5, cursor: "pointer",
//                       border: `1.5px solid ${active ? "#bfdbfe" : "#f1f5f9"}`,
//                       background: active ? "#EFF6FF" : "white",
//                       transition: "all .15s", fontFamily: "'DM Sans', sans-serif",
//                     }}
//                   >
//                     <p style={{ margin: "0 0 4px", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: active ? "#1D4ED8" : "#64748b", letterSpacing: "0.04em" }}>
//                       {r?.regNumber || r?.user?.regNumber || "—"}
//                     </p>
//                     <p style={{ margin: "0 0 7px", fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>
//                       {r.user.profile?.fullName ?? r.user.username}
//                     </p>
//                     <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                       <span style={{ fontSize: 10, background: active ? "#1D4ED8" : "#f1f5f9", color: active ? "white" : "#64748b", padding: "2px 7px", borderRadius: 5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
//                         {r.user.userType}
//                       </span>
//                       <span style={{ fontSize: 10, color: "#94a3b8" }}>{relativeTime(r.createdAt)}</span>
//                     </div>
//                   </button>
//                 );
//               })
//             )}
//           </div>

//           <div style={{ padding: "10px 16px", borderTop: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", alignItems: "center", gap: 7 }}>
//             <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
//             <span style={{ fontSize: 10, color: "#94a3b8" }}>{session.rldc} — Online</span>
//           </div>
//         </aside>

//         {/* ── Main Content ── */}
//         <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
//           <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

//             {/* Page title */}
//             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//               <div>
//                 <p style={{ margin: "0 0 4px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8" }}>RLDC Coordinator</p>
//                 <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>Registration Review</h1>
//               </div>
//               {session && meta && (
//                 <div style={{ display: "flex", alignItems: "center", gap: 8, background: meta.bg, border: `1.5px solid ${meta.border}`, borderRadius: 10, padding: "7px 14px" }}>
//                   <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
//                   <span style={{ fontSize: 12, fontWeight: 700, color: meta.color, fontFamily: "'DM Mono', monospace" }}>{session.rldc}</span>
//                   <span style={{ fontSize: 11, color: "#64748b" }}>— {meta.full}</span>
//                 </div>
//               )}
//             </div>

//             {/* Action result banners */}
//             {actionState === "success" && (
//               <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
//                 <span style={{ fontSize: 20 }}>✅</span>
//                 <div>
//                   <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#15803d" }}>Request Forwarded</p>
//                   <p style={{ margin: 0, fontSize: 11, color: "#16a34a" }}>{actionMessage} Select another request from the queue.</p>
//                 </div>
//               </div>
//             )}
//             {actionState === "error" && actionMessage && (
//               <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
//                 <span style={{ fontSize: 20 }}>⚠️</span>
//                 <div>
//                   <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#92400e" }}>Action Failed</p>
//                   <p style={{ margin: 0, fontSize: 11, color: "#b45309" }}>{actionMessage}</p>
//                 </div>
//               </div>
//             )}

//             {/* Empty state */}
//             {!selectedId && actionState !== "success" && (
//               <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", padding: "80px 24px", textAlign: "center" }}>
//                 <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
//                   <svg width="26" height="26" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                   </svg>
//                 </div>
//                 <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#475569" }}>No request selected</p>
//                 <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Select a pending request from the queue to begin review.</p>
//               </div>
//             )}

//             {/* Record card */}
//             {selectedId && selectedRequest && u && (
//               <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>

//                 {/* Card header */}
//                 <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc" }}>
//                   <div>
//                     <h2 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Coordinator Review — {session.rldc}</h2>
//                     <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>Verify the applicant details, assign a role, and forward to Admin or reject the request.</p>
//                   </div>
//                   <span style={{ fontSize: 10, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", padding: "4px 11px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, fontFamily: "'DM Mono', monospace" }}>
//                     Step 2 / 4
//                   </span>
//                 </div>

//                 <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>

//                   {/* Progress bar */}
//                   <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 20 }}>
//                     <ProgressBar currentStep={1} />
//                   </div>

//                   {/* Summary grid */}
//                   <section>
//                     <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Request Summary</p>
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #f1f5f9", borderRadius: 11, overflow: "hidden" }}>
//                       {[
//                         { label: "Applicant",     value: u.profile?.fullName ?? u.username,                        type: "text" },
//                         { label: "Status",        value: selectedRequest.status,                                   type: "amber" },
//                         { label: "Entity Name",   value: u.entity?.entityName ?? "—",                              type: "text" },
//                         { label: "Entity Type",   value: u.entity?.substation ?? "—",                              type: "text" },
//                         { label: "User Type",     value: fmt(u.userType),                                          type: "blue" },
//                         { label: "Designation",   value: u.profile?.designation ?? "—",                           type: "blue" },
//                         { label: "Submitted",     value: fmtDate(u.createdAt),                                     type: "mono" },
//                         { label: "Reg. Number",   value: u.regNumber || selectedRequest.regNumber || "—",          type: "mono" },
//                       ].map((c, i) => (
//                         <div key={i} style={{ padding: "12px 16px", background: i % 4 < 2 ? "#fafbfc" : "white", borderBottom: i < 6 ? "1px solid #f1f5f9" : "none", borderRight: i % 2 === 0 ? "1px solid #f1f5f9" : "none" }}>
//                           <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{c.label}</p>
//                           {c.type === "text"  && <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{c.value}</p>}
//                           {c.type === "mono"  && <p style={{ margin: 0, fontSize: 11.5, fontFamily: "'DM Mono', monospace", color: "#475569" }}>{c.value}</p>}
//                           {c.type === "amber" && <span style={{ fontSize: 10.5, background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a", padding: "2px 9px", borderRadius: 5, fontWeight: 700 }}>{c.value}</span>}
//                           {c.type === "blue"  && <span style={{ fontSize: 10.5, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "2px 9px", borderRadius: 5, fontWeight: 700 }}>{c.value}</span>}
//                         </div>
//                       ))}
//                     </div>
//                   </section>

//                   {/* Contact details */}
//                   {u.profile && (
//                     <section style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px" }}>
//                       <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Contact Details</p>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                         {[
//                           { label: "Email",       value: u.profile.email },
//                           { label: "Phone",       value: u.profile.phone },
//                           { label: "Alt. Email",  value: u.profile.altEmail },
//                           { label: "Alt. Phone",  value: u.profile.altPhone },
//                         ].filter(c => c.value).map(c => (
//                           <div key={c.label}>
//                             <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{c.label}</p>
//                             <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{c.value}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </section>
//                   )}

//                   {/* Entity details */}
//                   {u.entity && (
//                     <section style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "16px 18px" }}>
//                       <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#92400e" }}>Entity Information</p>
//                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
//                         {[
//                           { label: "Entity Name",   value: u.entity.entityName },
//                           { label: "Substation",    value: u.entity.substation },
//                           { label: "Owner Name",    value: u.entity.ownerName },
//                           { label: "Owner Email",   value: u.entity.ownerEmail },
//                           { label: "Owner Phone",   value: u.entity.ownerPhone },
//                           { label: "RLDC",          value: u.entity.rldc || session.rldc },
//                         ].filter(c => c.value).map(c => (
//                           <div key={c.label}>
//                             <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{c.label}</p>
//                             <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{c.value}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </section>
//                   )}

//                   {/* Meters */}
//                   {u.meters.length > 0 && (
//                     <section>
//                       <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Submitted Meters</p>
//                       <div style={{ border: "1px solid #f1f5f9", borderRadius: 11, overflow: "hidden" }}>
//                         <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", padding: "8px 16px" }}>
//                           {["#", "Meter No", "Owner"].map(h => (
//                             <p key={h} style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{h}</p>
//                           ))}
//                         </div>
//                         {u.meters.map((m, i) => (
//                           <div key={m.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr", padding: "11px 16px", borderBottom: i < u.meters.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "white" : "#fafbfc" }}>
//                             <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{i + 1}</p>
//                             <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>{m.meterNo}</p>
//                             <p style={{ margin: 0, fontSize: 12.5, color: "#475569" }}>{m.meterOwner}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </section>
//                   )}

//                   {/* On-forward triggers */}
//                   <section>
//                     <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>On Forward — Triggered for Admin Review</p>
//                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                       <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 16px" }}>
//                         <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#1e3a8a" }}>📋 Role Assignment</p>
//                         <p style={{ margin: "0 0 6px", fontSize: 11, color: "#2563eb", fontWeight: 600 }}>
//                           {formData.assignedRole ? fmt(formData.assignedRole) : "Not yet selected"}
//                         </p>
//                         <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.5 }}>Role will be locked and forwarded to RLDC Admin.</p>
//                       </div>
//                       <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 16px" }}>
//                         <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#14532d" }}>🔔 Admin Notification</p>
//                         <p style={{ margin: "0 0 6px", fontSize: 11, color: "#16a34a", fontWeight: 600 }}>To: {session.rldc} Admin</p>
//                         <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.5 }}>Admin will be notified for final approval.</p>
//                       </div>
//                     </div>
//                   </section>

//                   {/* Assign Role + Remarks + Actions */}
//                   <section style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>

//                     {/* Assign role */}
//                     <div style={{ marginBottom: 14 }}>
//                       <label style={{ ...labelStyle, marginBottom: 7 }}>
//                         Assign Role <span style={{ color: "#ef4444" }}>*</span>
//                       </label>
//                       <select
//                         value={formData.assignedRole}
//                         onChange={e => setFormData({ ...formData, assignedRole: e.target.value })}
//                         disabled={actionState === "loading"}
//                         style={{ ...inputStyle, cursor: "pointer", appearance: "auto" as const }}
//                       >
//                         <option value="">Select Role…</option>
//                         <option value="SUBSTATION_USER">Substation User</option>
//                         <option value="OWNER_COORDINATOR">Owner Coordinator</option>
//                         <option value="QCA_USER">QCA User</option>
//                       </select>
//                     </div>

//                     {/* Remarks */}
//                     <div style={{ marginBottom: 18 }}>
//                       <label style={{ ...labelStyle, marginBottom: 7 }}>
//                         Remarks <span style={{ fontWeight: 400, color: "#94a3b8" }}>(required when rejecting)</span>
//                       </label>
//                       <textarea
//                         value={remarks}
//                         onChange={e => setRemarks(e.target.value)}
//                         placeholder="Enter remarks or reason for rejection…"
//                         disabled={actionState === "loading"}
//                         rows={3}
//                         style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#0f172a", background: actionState === "loading" ? "#f8fafc" : "white", outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "none", lineHeight: 1.6, opacity: actionState === "loading" ? 0.6 : 1, boxSizing: "border-box" as const }}
//                       />
//                     </div>

//                     <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
//                       {!remarks.trim() && actionState === "idle" && (
//                         <p style={{ margin: 0, fontSize: 10.5, color: "#94a3b8" }}>← Add a remark to enable rejection</p>
//                       )}
//                       <button
//                         onClick={handleReject}
//                         disabled={!remarks.trim() || actionState === "loading"}
//                         style={{ padding: "9px 20px", border: "1.5px solid #e2e8f0", borderRadius: 9, background: "white", color: "#475569", fontSize: 13, fontWeight: 700, cursor: (!remarks.trim() || actionState === "loading") ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: (!remarks.trim() || actionState === "loading") ? 0.4 : 1 }}>
//                         {actionState === "loading" ? "Processing…" : "Reject"}
//                       </button>
//                       <button
//                         onClick={handleForward}
//                         disabled={actionState === "loading"}
//                         style={{ padding: "9px 22px", background: actionState === "loading" ? "#475569" : "#1D4ED8", border: "none", borderRadius: 9, color: "white", fontSize: 13, fontWeight: 700, cursor: actionState === "loading" ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 7, boxShadow: actionState === "idle" ? "0 2px 8px rgba(29,78,216,0.25)" : "none" }}>
//                         {actionState === "loading" ? "Processing…" : (
//                           <>
//                             Forward to Admin
//                             <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </section>

//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import ProgressBar from "@/components/ProgressBar";

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
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmt(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#374151",
  marginBottom: 5, fontFamily: "'DM Sans', sans-serif",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0",
  borderRadius: 9, fontSize: 13, color: "#0f172a", background: "#f8fafc",
  outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" as const,
};

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

  // ── Load requests — no rldc in query; route reads it from the session cookie ──
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
          remarks,
        }),
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

  const u = selectedRequest?.user;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <aside style={{ width: 300, background: "white", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0 }}>

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

          <div style={{ padding: "12px 18px 8px", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ margin: "0 0 2px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Pending Queue</p>
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
                const displayId = r.id.slice(-8).toUpperCase();
                return (
                  <button
                    key={r.id}
                    onClick={() => { setSelectedId(r.id); setActionState("idle"); setActionMessage(""); setRemarks(""); setFormData({ assignedRole: "" }); }}
                    style={{
                      width: "100%", textAlign: "left", padding: "11px 13px", borderRadius: 10, marginBottom: 5, cursor: "pointer",
                      border: `1.5px solid ${active ? "#bfdbfe" : "#f1f5f9"}`,
                      background: active ? "#EFF6FF" : "white",
                      transition: "all .15s", fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: active ? "#1D4ED8" : "#64748b", letterSpacing: "0.04em" }}>
                      REQ-{displayId}
                    </p>
                    <p style={{ margin: "0 0 7px", fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>
                      {r.user.profile?.fullName ?? r.user.username}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, background: active ? "#1D4ED8" : "#f1f5f9", color: active ? "white" : "#64748b", padding: "2px 7px", borderRadius: 5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
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
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8" }}>RLDC Coordinator</p>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>Registration Review</h1>
              </div>
              {session && meta && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: meta.bg, border: `1.5px solid ${meta.border}`, borderRadius: 10, padding: "7px 14px" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: meta.color, fontFamily: "'DM Mono', monospace" }}>{session.rldc}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>— {meta.full}</span>
                </div>
              )}
            </div>

            {actionState === "success" && (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#15803d" }}>Request Forwarded</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#16a34a" }}>{actionMessage} Select another request from the queue.</p>
                </div>
              </div>
            )}
            {actionState === "error" && actionMessage && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#92400e" }}>Action Failed</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#b45309" }}>{actionMessage}</p>
                </div>
              </div>
            )}

            {!selectedId && actionState !== "success" && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", padding: "80px 24px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <svg width="26" height="26" fill="none" stroke="#94a3b8" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#475569" }}>No request selected</p>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Select a pending request from the queue to begin review.</p>
              </div>
            )}

            {selectedId && selectedRequest && u && (
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>

                <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc" }}>
                  <div>
                    <h2 style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Coordinator Review — {session.rldc}</h2>
                    <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>Verify the applicant details, assign a role, and forward to Admin or reject the request.</p>
                  </div>
                  <span style={{ fontSize: 10, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", padding: "4px 11px", borderRadius: 99, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, fontFamily: "'DM Mono', monospace" }}>
                    Step 2 / 4
                  </span>
                </div>

                <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>

                  <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 20 }}>
                    <ProgressBar currentStep={1} />
                  </div>

                  <section>
                    <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Request Summary</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid #f1f5f9", borderRadius: 11, overflow: "hidden" }}>
                      {[
                        { label: "Applicant", value: u.profile?.fullName ?? u.username, type: "text" },
                        { label: "Status", value: selectedRequest.status, type: "amber" },
                        { label: "Entity Name", value: u.entity?.entityName ?? "—", type: "text" },
                        { label: "Entity Type", value: u.entity?.substation ?? "—", type: "text" },
                        { label: "User Type", value: fmt(u.userType), type: "blue" },
                        { label: "Designation", value: u.profile?.designation ?? "—", type: "blue" },
                        { label: "Submitted", value: fmtDate(u.createdAt), type: "mono" },
                        { label: "Request ID", value: `REQ-${selectedRequest.id.slice(-8).toUpperCase()}`, type: "mono" },
                      ].map((c, i) => (
                        <div key={i} style={{ padding: "12px 16px", background: i % 4 < 2 ? "#fafbfc" : "white", borderBottom: i < 6 ? "1px solid #f1f5f9" : "none", borderRight: i % 2 === 0 ? "1px solid #f1f5f9" : "none" }}>
                          <p style={{ margin: "0 0 5px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{c.label}</p>
                          {c.type === "text" && <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{c.value}</p>}
                          {c.type === "mono" && <p style={{ margin: 0, fontSize: 11.5, fontFamily: "'DM Mono', monospace", color: "#475569" }}>{c.value}</p>}
                          {c.type === "amber" && <span style={{ fontSize: 10.5, background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a", padding: "2px 9px", borderRadius: 5, fontWeight: 700 }}>{c.value}</span>}
                          {c.type === "blue" && <span style={{ fontSize: 10.5, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "2px 9px", borderRadius: 5, fontWeight: 700 }}>{c.value}</span>}
                        </div>
                      ))}
                    </div>
                  </section>

                  {u.profile && (
                    <section style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 18px" }}>
                      <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Contact Details</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {[
                          { label: "Email", value: u.profile.email },
                          { label: "Phone", value: u.profile.phone },
                          { label: "Alt. Email", value: u.profile.altEmail },
                          { label: "Alt. Phone", value: u.profile.altPhone },
                        ].filter(c => c.value).map(c => (
                          <div key={c.label}>
                            <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{c.label}</p>
                            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{c.value}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {u.entity && (
                    <section style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "16px 18px" }}>
                      <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#92400e" }}>Entity Information</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {[
                          { label: "Entity Name", value: u.entity.entityName },
                          { label: "Substation", value: u.entity.substation },
                          { label: "Owner Name", value: u.entity.ownerName },
                          { label: "Owner Email", value: u.entity.ownerEmail },
                          { label: "Owner Phone", value: u.entity.ownerPhone },
                          { label: "RLDC", value: u.entity.rldc || session.rldc },
                        ].filter(c => c.value).map(c => (
                          <div key={c.label}>
                            <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{c.label}</p>
                            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{c.value}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {u.meters.length > 0 && (
                    <section>
                      <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>Submitted Meters</p>
                      <div style={{ border: "1px solid #f1f5f9", borderRadius: 11, overflow: "hidden" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", padding: "8px 16px" }}>
                          {["#", "Meter No", "Owner"].map(h => (
                            <p key={h} style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>{h}</p>
                          ))}
                        </div>
                        {u.meters.map((m, i) => (
                          <div key={m.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr", padding: "11px 16px", borderBottom: i < u.meters.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "white" : "#fafbfc" }}>
                            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{i + 1}</p>
                            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>{m.meterNo}</p>
                            <p style={{ margin: 0, fontSize: 12.5, color: "#475569" }}>{m.meterOwner}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#94a3b8" }}>On Forward — Triggered for Admin Review</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 16px" }}>
                        <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#1e3a8a" }}>📋 Role Assignment</p>
                        <p style={{ margin: "0 0 6px", fontSize: 11, color: "#2563eb", fontWeight: 600 }}>
                          {formData.assignedRole ? fmt(formData.assignedRole) : "Not yet selected"}
                        </p>
                        <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.5 }}>Role will be locked and forwarded to RLDC Admin.</p>
                      </div>
                      <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "14px 16px" }}>
                        <p style={{ margin: "0 0 4px", fontSize: 12.5, fontWeight: 700, color: "#14532d" }}>🔔 Admin Notification</p>
                        <p style={{ margin: "0 0 6px", fontSize: 11, color: "#16a34a", fontWeight: 600 }}>To: {session.rldc} Admin</p>
                        <p style={{ margin: 0, fontSize: 10.5, color: "#64748b", lineHeight: 1.5 }}>Admin will be notified for final approval.</p>
                      </div>
                    </div>
                  </section>

                  <section style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ ...labelStyle, marginBottom: 7 }}>
                        Assign Role <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <select
                        value={formData.assignedRole}
                        onChange={e => setFormData({ ...formData, assignedRole: e.target.value })}
                        disabled={actionState === "loading"}
                        style={{ ...inputStyle, cursor: "pointer", appearance: "auto" as const }}
                      >
                        <option value="">Select Role…</option>
                        <option value="SUBSTATION_USER">Substation User</option>
                        <option value="OWNER_COORDINATOR">Owner Coordinator</option>
                        <option value="QCA_USER">QCA User</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={{ ...labelStyle, marginBottom: 7 }}>
                        Remarks <span style={{ fontWeight: 400, color: "#94a3b8" }}>(required when rejecting)</span>
                      </label>
                      <textarea
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        placeholder="Enter remarks or reason for rejection…"
                        disabled={actionState === "loading"}
                        rows={3}
                        style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13, color: "#0f172a", background: actionState === "loading" ? "#f8fafc" : "white", outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "none", lineHeight: 1.6, opacity: actionState === "loading" ? 0.6 : 1, boxSizing: "border-box" as const }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
                     
                      {/* Reject Button */}
                      <button
                        onClick={handleReject}
                        disabled={actionState === "loading"}
                        style={{
                          padding: "10px 20px",
                          borderRadius: 9,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#dc2626",
                          background: "white",
                          border: "1.5px solid #fecaca",
                          cursor: actionState === "loading" ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "#fef2f2")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "white")}
                      >
                        Reject Request
                      </button>

                      {/* Forward Button */}
                      <button
                        onClick={handleForward}
                        disabled={actionState === "loading" || !formData.assignedRole}
                        style={{
                          padding: "10px 24px",
                          borderRadius: 9,
                          fontSize: 13,
                          fontWeight: 700,
                          color: "white",
                          background: actionState === "loading" || !formData.assignedRole ? "#94a3b8" : "#1d4ed8",
                          border: "none",
                          cursor: actionState === "loading" || !formData.assignedRole ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: formData.assignedRole ? "0 4px 12px rgba(29, 78, 216, 0.2)" : "none",
                        }}
                      >
                        {actionState === "loading" ? (
                          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                            Processing...
                          </span>
                        ) : (
                          "Forward to Admin"
                        )}
                      </button>
                    </div>
                  </section>

                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

