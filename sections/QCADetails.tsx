"use client";

import SectionCard from "@/components/SectionCard";

export default function QCADetails() {
  return (
    <div id="qcadetails">
    <SectionCard title="Section F - QCA Details">
      <div className="grid md:grid-cols-2 gap-5">

        <input
          className="border p-3 rounded"
          placeholder="QCA License Number"
        />

        <input
          className="border p-3 rounded"
          placeholder="Managed Stations"
        />

      </div>
    </SectionCard>
    </div>
  );
}