"use client";

import { useState, useEffect } from "react";
import SectionCard from "./SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function MeterDetails({ setFormData }: Props) {
  const [rows, setRows] = useState([
    { meterNo: "", meterOwner: "" },
  ]);

  const handleChange = (
    index: number,
    field: "meterNo" | "meterOwner",
    value: string
  ) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { meterNo: "", meterOwner: "" }]);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) return; // keep at least one row
    setRows(rows.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setFormData({ meters: rows });
  }, [rows]);

  return (
    <div id="meterdetails">
      <SectionCard title="Section F - Meter Details">
        <div className="space-y-6">

          {rows.map((row, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              
              {/* Row Header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Meter {index + 1}
                </p>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-red-500 hover:text-red-700 text-[11px] font-bold uppercase tracking-wide transition-all flex items-center gap-1"
                  >
                    <span className="text-base leading-none">×</span> Remove
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Meter No */}
                <div>
                  <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
                    Meter No. {index + 1} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
                    placeholder="Enter meter number (e.g. MTR001)"
                    value={row.meterNo}
                    onChange={(e) => handleChange(index, "meterNo", e.target.value)}
                  />
                </div>

                {/* Meter Owner */}
                <div>
                  <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
                    Meter Owner
                  </label>
                  <input
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
                    placeholder="Enter name of meter owner"
                    value={row.meterOwner}
                    onChange={(e) => handleChange(index, "meterOwner", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Button Section */}
          <div className="pt-2">
            <button
              type="button"
              onClick={addRow}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-md flex items-center gap-2"
            >
              <span className="text-lg">+</span> Add 
            </button>
            <p className="mt-3 text-[11px] text-slate-400 italic">
              * Click the button above to add multiple meters if required.
            </p>
          </div>

        </div>
      </SectionCard>
    </div>
  );
}