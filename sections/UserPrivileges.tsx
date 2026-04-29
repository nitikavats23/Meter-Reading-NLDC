"use client";
import React from "react";
import SectionCard from "@/components/SectionCard"; // SectionCard import kiya

export default function UserPrivileges({ formData, setFormData }: any) {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "userType") {
      setFormData({
        ...formData,
        [name]: value,
        role: "" // User Type badalte hi purana selected role reset ho jayega
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Roles decide karne wala logic
  const getRoleOptions = () => {
    const type = formData.userType;
    
    // Case 1: NLDC aur RLDC ke liye special roles
    if (type === "NLDC" || type === "RLDC") {
      return [
        "RLDC Admin", 
        "RLDC Co-ordinator", 
        "RLDC User", 
        "RLDC Analyst"
      ];
    } 
    
    // Case 2: Baaki sab ke liye sirf User
    if (["OWNER", "SUBSTATION", "QCA"].includes(type)) {
      return ["User"];
    }

    return []; // Agar kuch select nahi hai
  };

  const roles = getRoleOptions();

  return (
    <div id="userprivileges">
      {/* Section A Wrap kar diya hai */}
      <SectionCard title="Section A - User Privileges">
        <div className="grid grid-cols-2 gap-8">
          {/* User Type Field */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              User Type <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all bg-white cursor-pointer"
            >
              <option value="">Select User Type</option>
              <option value="NLDC">NLDC</option>
              <option value="RLDC">RLDC</option>
              <option value="OWNER">Owner</option>
              <option value="SUBSTATION">Substation</option>
              <option value="QCA">QCA</option>
            </select>
          </div>

          {/* Select Role Field (Conditional Options) */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Select Role <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!formData.userType}
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all bg-white disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r} value={r.toLowerCase().replace(/\s+/g, '')}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}