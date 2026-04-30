"use client";
import React from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  formData: FormDataType;
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function UserPrivileges({ formData, setFormData }: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "userType") {
      setFormData({
        userType: value,
        role: "",
        qcaDetails:
          value === "QCA"
            ? { licenseNumber: "", managedStations: "" }
            : undefined,
      });
    }

    if (name === "role") {
      setFormData({ role: value });
    }
  };

  const getRoleOptions = (): { label: string; value: string }[] => {
    const type = formData.userType;

    if (type === "NLDC" || type === "RLDC") {
      return [
        { label: "RLDC Admin", value: "RLDC_ADMIN" },
        { label: "RLDC Co-ordinator", value: "RLDC_COORDINATOR" },
        { label: "RLDC User", value: "RLDC_USER" },
        { label: "RLDC Analyst", value: "RLDC_ANALYST" },
      ];
    }

    if (["OWNER", "SUBSTATION", "QCA"].includes(type)) {
      return [{ label: "User", value: "USER" }];
    }

    return [];
  };

  const roles = getRoleOptions();

  return (
    <div id="userprivileges">
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

          {/* Select Role Field */}
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
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}