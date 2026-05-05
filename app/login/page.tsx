"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

type LoginMode = "username" | "email";
type Role = "USER" | "COORDINATOR" | "ADMIN";

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("username");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) { alert("Please complete the CAPTCHA"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier, password, role, rememberMe, captcha: captchaToken,
        }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      recaptchaRef.current?.reset();
      setCaptchaToken("");
      if (res.ok) {
        if (role === "ADMIN") router.push("/admin/dashboard");
        else if (role === "COORDINATOR") router.push("/coordinator/dashboard");
        else router.push("/dashboard");
        router.refresh();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
      recaptchaRef.current?.reset();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Sign In</h1>
          <p className="text-xs text-slate-400 mt-1">Enter your credentials to continue</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 rounded-lg p-1 mb-4 relative">
          <div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-transform duration-300"
            style={{ transform: mode === "email" ? "translateX(calc(100%))" : "translateX(0)", left: "4px" }}
          />
          {(["username", "email"] as LoginMode[]).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setIdentifier(""); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md relative z-10 transition-colors capitalize
                ${mode === m ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}`}>
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-3">

          {/* Role dropdown */}
          <div>
            <label className="block text-xs  font-bold text-slate-800  mb-1">Login As</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="USER">User</option>
                <option value="COORDINATOR">Coordinator</option>
                <option value="ADMIN">Admin</option>
              </select>
              {/* Custom chevron */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Identifier */}
          <div>
            <label className="block text-xs font-bold text-slate-800  mb-1">
              {mode === "username" ? "Username" : "Email"}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {mode === "username" ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </span>
              <input
                type={mode === "email" ? "email" : "text"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={mode === "username" ? "Enter your username" : "Enter your email"}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold  text-slate-800  mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-blue-600 rounded" />
              <span className="text-xs text-slate-500">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-xs text-blue-600 font-medium hover:underline">
              Forgot password?
            </a>
          </div>

          {/* CAPTCHA */}
          <div className="flex justify-center scale-90 origin-center -mx-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              theme="light"
              size="normal"
              onChange={(token) => setCaptchaToken(token ?? "")}
              onExpired={() => setCaptchaToken("")}
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-xs text-slate-400 pt-1">
            Dont have an account?{" "}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}