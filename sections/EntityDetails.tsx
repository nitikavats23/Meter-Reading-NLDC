"use client";
import React from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  formData: FormDataType;
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function EntityDetails({ formData, setFormData }: Props) {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      entity: {
        ...formData.entity,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      entity: {
        ...formData.entity,
        [e.target.name]: e.target.value,
      },
    });
  };

  // RLDC Regions ke options jo har user type ke liye dikhenge
  const rldcRegionOptions = [
    { label: "ERLDC", value: "ERLDC" },
    { label: "NRLDC", value: "NRLDC" },
    { label: "WRLDC", value: "WRLDC" },
    { label: "SRLDC", value: "SRLDC" },
    { label: "NERLDC", value: "NERLDC" },
    { label: "NLDC", value: "NLDC" },
  ];

  return (
    <SectionCard title="Section D - Entity Details">
      <div className="grid grid-cols-2 gap-8">

        {/* Field 1: Entity Owner */}
        <div>
          <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
            Entity Owner <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            value="GRID India"
            disabled
            className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] text-slate-500 font-bold bg-gray-50 cursor-not-allowed outline-none"
          />
        </div>

        {/* Updated RLDC Field: Sabhi User Types ke liye same dropdown */}
        {formData.userType && (
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              RLDC <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              name="rldc"
              value={formData.entity?.rldc || ""}
              onChange={handleSelectChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all bg-white cursor-pointer"
            >
              <option value="">Select RLDC</option>
              {rldcRegionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Common Entity Fields */}
        {formData.userType && (
          <>
            <div>
              <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
                Entity Name <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="entityName"
                value={formData.entity?.entityName || ""}
                onChange={handleInputChange}
                placeholder="Enter entity name"
                className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
                Owner Email <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="email"
                name="ownerEmail"
                value={formData.entity?.ownerEmail || ""}
                onChange={handleInputChange}
                placeholder="Enter owner email"
                className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
                Owner Contact No <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="ownerPhone"
                value={formData.entity?.ownerPhone || ""}
                onChange={handleInputChange}
                placeholder="Enter owner contact number"
                className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              />
            </div>
          </>
        )}
      </div>
    </SectionCard>
  );
}