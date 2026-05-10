"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const REGIONS = ["NRLDC", "SRLDC", "ERLDC", "WRLDC", "NERLDC"] as const;
type Region = (typeof REGIONS)[number];

const REGION_META: Record<Region, { label: string; color: string; bg: string; border: string }> = {
  NRLDC:  { label: "Northern",   color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  SRLDC:  { label: "Southern",   color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
  ERLDC:  { label: "Eastern",    color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  WRLDC:  { label: "Western",    color: "#8b5cf6", bg: "#faf5ff", border: "#ddd6fe" },
  NERLDC: { label: "North-East", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
};

type RLDCAdmin = {
  id:        string;
  username:  string;
  userType:  string;
  createdAt: string;
  profile:   { fullName: string; email: string; phone: string; designation: string } | null;
  entity:    { rldc: string; entityName: string } | null;
  role:      { role: string } | null;
  approvals: { status: string }[];
};

type FormData = {
  username:    string;
  password:    string;
  fullName:    string;
  email:       string;
  phone:       string;
  designation: string;
  region:      Region | "";
};

const EMPTY_FORM: FormData = {
  username:    "",
  password:    "",
  fullName:    "",
  email:       "",
  phone:       "",
  designation: "RLDC Admin ",
  region:      "",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 9,
  fontSize: 13, color: "#0f172a", background: "#f8fafc", outline: "none",
  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
};

export default function SuperAdminDashboard() {
  const router = useRouter();

  const [admins,     setAdmins]     = useState<RLDCAdmin[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [showPass,   setShowPass]   = useState(false);

  
  useEffect(() => {
    let cancelled = false;

    const loadAdmins = async () => {
      setLoading(true);
      try {
        const res  = await fetch("/api/super-admin/rldc-admins");
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) setAdmins(data.data);
        else if (res.status === 401) router.push("/login");
      } catch {
        if (!cancelled) setError("Failed to load admins");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAdmins();
    return () => { cancelled = true; };
  }, [router]);

  //  Separate refetch used after create/delete
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/super-admin/rldc-admins");
      const data = await res.json();
      if (res.ok) setAdmins(data.data);
    } catch {
      setError("Failed to reload admins");
    } finally {
      setLoading(false);
    }
  };

  const takenRegions     = admins.map((a) => a.entity?.rldc).filter(Boolean) as Region[];
  const availableRegions = REGIONS.filter((r) => !takenRegions.includes(r));

  const handleSubmit = async () => {
    setError("");
    if (!form.username || !form.password || !form.fullName || !form.email || !form.phone || !form.region) {
      setError("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res  = await fetch("/api/super-admin/rldc-admins", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setShowModal(false);
        setForm(EMPTY_FORM);
        await fetchAdmins();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.message || "Failed to create admin");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch("/api/super-admin/rldc-admins", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId }),
      });
      if (res.ok) {
        setSuccess("RLDC Admin removed");
        setDeleteId(null);
        await fetchAdmins();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      setError("Delete failed");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };
  // const slotsRemainingColor = admins.length >= 5 ? "#94a3b8" : "#f59e0b";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* ── Navbar ──
      <nav style={{ background: "#0f172a", borderBottom: "1px solid #1e293b", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>
            GRID India — Super Admin
          </span>
        </div>
        <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #334155", color: "#94a3b8", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </nav> */}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
            RLDC Admin Management
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>
            Manage the 5 Regional Load Despatch Centre administrators
          </p>
        </div>

        {/* ── Banners ── */}
        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#15803d", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}
        {error && !showModal && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#dc2626", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Total RLDC Admins", value: admins.length,       color: "#3b82f6" },
            { label: "Regions Assigned",  value: takenRegions.length, color: "#10b981" },
            // { label: "Slots Remaining",   value: 5 - admins.length,   color: admins.length >= 5 ? "#94a3b8" : "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: 12, padding: "20px 24px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace" }}>
                {s.value}<span style={{ fontSize: 16, color: "#cbd5e1", fontWeight: 400 }}>/5</span>
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Region Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 28 }}>
          {REGIONS.map((region) => {
            const admin = admins.find((a) => a.entity?.rldc === region);
            const meta  = REGION_META[region];
            return (
              <div key={region} style={{ background: admin ? meta.bg : "white", border: `1.5px solid ${admin ? meta.border : "#e2e8f0"}`, borderRadius: 12, padding: "16px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", color: admin ? meta.color : "#94a3b8", fontFamily: "'DM Mono', monospace" }}>
                    {region}
                  </span>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: admin ? meta.color : "#e2e8f0" }} />
                </div>
                <div style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{meta.label}</div>
                <div style={{ marginTop: 6, fontSize: 11, color: admin ? "#64748b" : "#94a3b8" }}>
                  {admin ? admin.profile?.fullName : "Unassigned"}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Table Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>
            RLDC Administrators <span style={{ color: "#94a3b8", fontWeight: 400 }}>({admins.length}/5)</span>
          </h2>
          {admins.length < 5 && (
            <button
              onClick={() => { setShowModal(true); setError(""); setForm(EMPTY_FORM); }}
              style={{ background: "#0f172a", color: "white", border: "none", padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7 }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add RLDC Admin
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>Loading...</div>
          ) : admins.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗂️</div>
              <div style={{ color: "#475569", fontWeight: 600, fontSize: 15 }}>No RLDC Admins yet</div>
              <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>Click Add RLDC Admin to get started</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  {["Region", "Full Name", "Username", "Email", "Phone", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.5px", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, i) => {
                  const region = (admin.entity?.rldc as Region) || "NRLDC";
                  const meta   = REGION_META[region] || REGION_META.NRLDC;
                  const status = admin.approvals?.[0]?.status || "Unknown";
                  return (
                    <tr key={admin.id} style={{ borderBottom: i < admins.length - 1 ? "1px solid #f1f5f9" : "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
                          {admin.entity?.rldc || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{admin.profile?.fullName || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569", fontFamily: "'DM Mono', monospace" }}>{admin.username}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{admin.profile?.email || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569" }}>{admin.profile?.phone || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                          {status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button onClick={() => setDeleteId(admin.id)}
                          style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "5px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Create Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24 }}>
          <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 480, padding: 28, boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Create RLDC Admin</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "#f1f5f9", border: "none", width: 32, height: 32, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#dc2626", fontSize: 13 }}>{error}</div>
            )}

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={labelStyle}>Region *</label>
                <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value as Region })} style={inputStyle}>
                  <option value="">Select a region</option>
                  {availableRegions.map((r) => (
                    <option key={r} value={r}>{r} — {REGION_META[r].label} Region</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} placeholder="e.g. Rajesh Kumar" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Username *</label>
                  <input style={inputStyle} placeholder="e.g. nrldc_admin" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Password *</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPass ? "text" : "password"} style={{ ...inputStyle, paddingRight: 36 }} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        {showPass ? (
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" style={inputStyle} placeholder="admin@nrldc.in" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Phone *</label>
                  <input style={inputStyle} placeholder="9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Designation</label>
                  <input style={inputStyle} placeholder="RLDC Administrator" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#475569" }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: "10px", background: "#0f172a", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "white", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Creating..." : "Create RLDC Admin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 380, padding: 28, boxShadow: "0 25px 50px rgba(0,0,0,0.25)", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" fill="none" stroke="#dc2626" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Remove RLDC Admin?</h3>
            <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 22px" }}>
              This will permanently delete the admin and all associated data.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#475569" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: "10px", background: "#dc2626", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "white" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}