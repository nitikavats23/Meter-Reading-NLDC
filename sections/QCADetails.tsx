"use client";

import React from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  formData: FormDataType;
};

export default function QCADetails({ formData, setFormData }: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      qcaDetails: {
        ...(prev.qcaDetails || {
          licenseNumber: "",
          managedStations: "",
        }),
        [name]: value,
      },
    }));
  };

  return (
    <div id="qcadetails">
      <SectionCard title="Section G - QCA Details">
        
        <div className="grid grid-cols-2 gap-8">
          
          {/* License Number */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              License Number
            </label>

            <input
              type="text"
              name="licenseNumber"
              value={formData.qcaDetails?.licenseNumber || ""}
              onChange={handleChange}
              placeholder="Enter License Number"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          {/* Managed Stations */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Managed Stations
            </label>

            <input
              type="text"
              name="managedStations"
              value={formData.qcaDetails?.managedStations || ""}
              onChange={handleChange}
              placeholder="Enter Managed Stations"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
            />
          </div>

        </div>

        {/* Info Note */}
        <p className="mt-4 text-xs text-gray-400 italic">
          * These details are only applicable if User Type is QCA. Validation is handled during submission.
        </p>

      </SectionCard>
    </div>
  );
}