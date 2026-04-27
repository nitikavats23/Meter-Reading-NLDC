"use client";
import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = { setFormData: React.Dispatch<React.SetStateAction<FormDataType>>; };

export default function Credentials({ setFormData }: Props) {
  const [userType, setUserType] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      credentials: { userType, username, password },
    }));
  }, [userType, username, password, setFormData]);

  return (
    <SectionCard title="Section A - Credentials">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-1">User Type *</label>
          <select className="w-full border p-3 rounded" value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="">Select</option>
            <option value="Station">Station</option>
            <option value="QCA">QCA</option>
            <option value="Owner">Owner</option>
            <option value="AMR">AMR</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Username / Email *</label>
          <input className="w-full border p-3 rounded" placeholder="Enter your email" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">Password *</label>
          <input type="password" className="w-full border p-3 rounded" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">Confirm Password *</label>
          <input type="password" className="w-full border p-3 rounded" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
      </div>
    </SectionCard>
  );
}