"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface CoordinatorUser {
  profile: { fullName: string; designation: string; email: string } | null;
  role: { role: string } | null;
}

const navLinks = [
  {
    href: "/dashboard/coordinator",
    label: "Requests",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/coordinator/profile",
    label: "Profile",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function CoordinatorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CoordinatorUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/user/me");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user);
      } catch {
        // silently fail — layout still renders
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  };

  const initials = user?.profile?.fullName
    ? user.profile.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("")
    : "CO";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #f4f5f7;
          --surface:   #ffffff;
          --border:    #e5e7eb;
          --text:      #111827;
          --muted:     #6b7280;
          --accent:    #1d4ed8;
          --accent-lt: #eff6ff;
          --accent-md: #bfdbfe;
          --danger:    #dc2626;
          --danger-lt: #fef2f2;
          --sidebar-w: 240px;
          --topbar-h:  60px;
          --radius:    10px;
          --font-head: 'Syne', sans-serif;
          --font-body: 'Outfit', sans-serif;
          --shadow:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
        }

        body {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        /* ── Root layout ── */
        .co-layout {
          display: flex;
          min-height: 100vh;
        }

        /* ── Sidebar ── */
        .co-sidebar {
          width: var(--sidebar-w);
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          transition: transform 0.25s cubic-bezier(.4,0,.2,1);
          box-shadow: var(--shadow-md);
        }

        .co-sidebar.collapsed {
          transform: translateX(calc(-1 * var(--sidebar-w)));
        }

        /* Brand */
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px;
          height: var(--topbar-h);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }

        .brand-mark {
          width: 32px; height: 32px;
          background: var(--accent);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }

        .brand-name {
          font-family: var(--font-head);
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: var(--text);
        }

        .brand-sub {
          font-size: 10px;
          color: var(--muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* User card */
        .sidebar-user {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          font-family: var(--font-head);
          font-size: 14px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.5px;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 11px;
          color: var(--muted);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Nav */
        .sidebar-nav {
          flex: 1;
          padding: 12px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .nav-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--muted);
          padding: 8px 10px 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--muted);
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.15s;
          position: relative;
        }

        .nav-link:hover {
          background: var(--accent-lt);
          color: var(--accent);
        }

        .nav-link.active {
          background: var(--accent-lt);
          color: var(--accent);
          font-weight: 600;
        }

        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 3px;
          background: var(--accent);
          border-radius: 0 3px 3px 0;
        }

        .nav-icon {
          flex-shrink: 0;
          opacity: 0.8;
        }

        .nav-link.active .nav-icon,
        .nav-link:hover .nav-icon {
          opacity: 1;
        }

        /* Logout */
        .sidebar-footer {
          padding: 12px 10px;
          border-top: 1px solid var(--border);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--danger);
          font-size: 13.5px;
          font-weight: 500;
          font-family: var(--font-body);
          transition: all 0.15s;
          text-align: left;
        }

        .logout-btn:hover {
          background: var(--danger-lt);
        }

        .logout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Topbar ── */
        .co-topbar {
          position: fixed;
          top: 0;
          left: var(--sidebar-w);
          right: 0;
          height: var(--topbar-h);
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 90;
          transition: left 0.25s cubic-bezier(.4,0,.2,1);
          box-shadow: var(--shadow);
        }

        .co-topbar.sidebar-collapsed {
          left: 0;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .toggle-btn {
          width: 34px; height: 34px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--muted);
          transition: all 0.15s;
        }

        .toggle-btn:hover {
          background: var(--accent-lt);
          color: var(--accent);
          border-color: var(--accent-md);
        }

        .page-breadcrumb {
          font-family: var(--font-head);
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.2px;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topbar-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: var(--accent-lt);
          border: 1px solid var(--accent-md);
          border-radius: 99px;
          font-size: 12px;
          font-weight: 600;
          color: var(--accent);
        }

        .status-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        /* ── Main content ── */
        .co-main {
          margin-left: var(--sidebar-w);
          margin-top: var(--topbar-h);
          flex: 1;
          min-height: calc(100vh - var(--topbar-h));
          transition: margin-left 0.25s cubic-bezier(.4,0,.2,1);
        }

        .co-main.sidebar-collapsed {
          margin-left: 0;
        }

        /* ── Mobile overlay ── */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 99;
          backdrop-filter: blur(2px);
        }

        @media (max-width: 768px) {
          .co-topbar { left: 0 !important; }
          .co-main { margin-left: 0 !important; }
          .co-sidebar { transform: translateX(calc(-1 * var(--sidebar-w))); }
          .co-sidebar.mobile-open { transform: translateX(0); }
          .sidebar-overlay { display: block; }
        }
      `}</style>

      <div className="co-layout">

        {/* Sidebar */}
        <aside className={`co-sidebar${sidebarOpen ? "" : " collapsed"}`}>

          {/* Brand */}
          <div className="sidebar-brand">
            <div className="brand-mark">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="brand-name">MeterSync</div>
              <div className="brand-sub">Coordinator Portal</div>
            </div>
          </div>

          {/* User */}
          <div className="sidebar-user">
            <div className="user-avatar">{initials}</div>
            <div style={{ overflow: "hidden" }}>
              <div className="user-name">{user?.profile?.fullName ?? "Coordinator"}</div>
              <div className="user-role">{user?.role?.role ?? "COORDINATOR"}</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            <div className="nav-section-label">Menu</div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${pathname === link.href ? " active" : ""}`}
              >
                <span className="nav-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="sidebar-footer">
            <button
              className="logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        {/* Topbar */}
        <header className={`co-topbar${sidebarOpen ? "" : " sidebar-collapsed"}`}>
          <div className="topbar-left">
            <button
              className="toggle-btn"
              onClick={() => setSidebarOpen((p) => !p)}
              aria-label="Toggle sidebar"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="page-breadcrumb">
              {navLinks.find((l) => l.href === pathname)?.label ?? "Dashboard"}
            </span>
          </div>

          <div className="topbar-right">
            <div className="topbar-badge">
              <span className="status-dot" />
              {user?.role?.role ?? "COORDINATOR"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`co-main${sidebarOpen ? "" : " sidebar-collapsed"}`}>
          {children}
        </main>

      </div>
    </>
  );
}