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
  }, [license, stations, setFormData]);

  return (
    <SectionCard title="Section F - QCA Details">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-1">QCA License Number *</label>
          <input className="w-full border p-3 rounded" placeholder="Enter QCA License Number" value={license} onChange={(e) => setLicense(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1">Managed Stations *</label>
          <input className="w-full border p-3 rounded" placeholder="Enter managed stations (e.g. Station A, B)" value={stations} onChange={(e) => setStations(e.target.value)} />
        </div>
      </div>
    </SectionCard>
  );
}