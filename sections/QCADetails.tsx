"use client";
import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = { setFormData: React.Dispatch<React.SetStateAction<FormDataType>>; };

export default function QCADetails({ setFormData }: Props) {
  const [license, setLicense] = useState("");
  const [stations, setStations] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      qcaDetails: { licenseNumber: license, managedStations: stations },
    }));

    return () => {
      setFormData((prev) => ({
        ...prev,
        qcaDetails: {}, 
      }));
    };
  }, [license, stations, setFormData]);

  return (
    <SectionCard title="Section G - QCA / Owner Details">
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Field 1: Owner License Number */}
        <div>
          <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
            Owner License Number <span className="text-red-500 font-bold">*</span>
          </label>
          <input 
            className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all" 
            placeholder="Enter Owner License Number" 
            value={license} 
            onChange={(e) => setLicense(e.target.value)} 
          />
        </div>

        {/* Field 2: Managed Stations */}
        <div>
          <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
            Managed Stations <span className="text-red-500 font-bold">*</span>
          </label>
          <input 
            className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all" 
            placeholder="Enter managed stations (e.g. Station A, B)" 
            value={stations} 
            onChange={(e) => setStations(e.target.value)} 
          />
        </div>

      </div>
    </SectionCard>
  );
}