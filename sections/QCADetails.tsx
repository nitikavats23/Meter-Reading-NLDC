"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

/* ✅ Props */
type Props = {
  setFormData: React.Dispatch<
    React.SetStateAction<FormDataType>
  >;
};

export default function QCADetails({ setFormData }: Props) {
  const [license, setLicense] = useState("");
  const [stations, setStations] = useState("");

  /* ✅ PUSH DATA TO PARENT */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      qcaDetails: {
        licenseNumber: license,
        managedStations: stations,
      },
    }));
  }, [license, stations, setFormData]);

  return (
    <div id="qcadetails">
      <SectionCard title="Section F - QCA Details">
        <div className="grid md:grid-cols-2 gap-5">

          {/* License Number */}
          <div>
            <label>QCA License Number *</label>
            <input
              className="w-full border p-3 rounded"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
            />
          </div>

          {/* Managed Stations */}
          <div>
            <label>Managed Stations *</label>
            <input
              className="w-full border p-3 rounded"
              value={stations}
              onChange={(e) => setStations(e.target.value)}
            />
          </div>

        </div>
      </SectionCard>
    </div>
  );
}