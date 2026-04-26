"use client";

import { useState } from "react";
import SectionCard from "./SectionCard";

export default function MeterDetails() {
  const [rows, setRows] = useState([
    { meterNo: "" },
  ]);

  const addRow = () => {
    setRows([...rows, { meterNo: "" }]);
  };

  return (
    <div id="meterdetails">
    <SectionCard title="Section E - Meter Details">
      <div className="space-y-4">

        {rows.map((row, index) => (
          <div key={index}>
            <input
              className="w-full border p-3 rounded"
              placeholder={`Meter Number ${
                index + 1
              }`}
            />
          </div>
        ))}

        <button
          onClick={addRow}
          className="bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Meter
        </button>

      </div>
    </SectionCard>
    </div>
  );
}