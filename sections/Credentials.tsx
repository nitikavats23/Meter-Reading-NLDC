"use client";
import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function Credentials({ setFormData }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Password validation logic
  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pass)) return "Must contain at least one uppercase letter.";
    if (!/[0-9]/.test(pass)) return "Must contain at least one number.";
    if (!/[!@#$%^&*]/.test(pass)) return "Must contain one special character (@, #, $, etc.).";
    return "";
  };

  const handleUpdate = () => {
    const passError = validatePassword(password);
    setError(passError);

    // Agar passwords match karte hain aur koi error nahi hai, tabhi update karein
    if (!passError && password === confirmPassword) {
      setFormData({
        credentials: { username, password },
      });
    }
  };

  return (
    <div id="credentials">
      <SectionCard title="Section B - Credentials">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Username Field */}
          <div className="md:col-span-2">
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Username / Email <span className="text-red-500 font-bold">*</span>
            </label>    
            <input 
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all" 
              placeholder="Enter your email" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              onBlur={handleUpdate} 
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Password <span className="text-red-500 font-bold">*</span>
            </label>
            <input 
              type="password" 
              className={`w-full border p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none transition-all ${
                error ? "border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setError(validatePassword(e.target.value));
              }} 
              onBlur={handleUpdate} 
            />
            {error && (
              <p className="text-red-500 text-[10px] mt-1 font-medium italic">
                {error}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Confirm Password <span className="text-red-500 font-bold">*</span>
            </label>
            <input 
              type="password" 
              className={`w-full border p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none transition-all ${
                confirmPassword && password !== confirmPassword ? "border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
              }`}
              placeholder="Re-enter password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              onBlur={handleUpdate}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 font-semibold italic text-right">
                ! Passwords do not match
              </p>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}