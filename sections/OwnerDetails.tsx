"use client";
import React from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  formData: FormDataType;
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function OwnerDetails({ formData, setFormData }: Props) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ownerDetails: {
        ...formData.ownerDetails,
        [name]: value,
      } as any,
    });
  };

  return (
    <div id="ownerdetails">
      <SectionCard title="Section H - Owner Details">
        <div className="grid grid-cols-2 gap-8">
          
          {/* Managed Station Field */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Managed Station <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              name="managedStations"
              value={formData.ownerDetails?.managedStations || ""}
              onChange={handleChange}
              placeholder="Enter managed stations"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* License Number Field */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              License Number <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.ownerDetails?.licenseNumber || ""}
              onChange={handleChange}
              placeholder="Enter license number"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
            />
          </div>

        </div>
      </SectionCard>
    </div>
  );
}