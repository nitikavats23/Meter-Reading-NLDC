"use client";
import { useState } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function Credentials({ setFormData }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Jab user input field se baahar click karega (onBlur), 
  // tabhi main form data update hoga. Isse infinite loop nahi banega.
  const handleUpdate = () => {
    setFormData({
      credentials: { username, password },
    });
  };

  return (
    <div id="credentials">
      <SectionCard title="Section B - Credentials">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Username Field */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Username / Email <span className="text-red-500 font-bold">*</span>
            </label>    
            <input 
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all" 
              placeholder="Enter your email" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              onBlur={handleUpdate} // Data sync on blur
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Password <span className="text-red-500 font-bold">*</span>
            </label>
            <input 
              type="password" 
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onBlur={handleUpdate} // Data sync on blur
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Confirm Password <span className="text-red-500 font-bold">*</span>
            </label>
            <input 
              type="password" 
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all" 
              placeholder="Re-enter password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 font-semibold italic">
                ! Passwords do not match
              </p>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}