"use client";

import { useState, useEffect } from "react";
import SectionCard from "./SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function MeterDetails({ setFormData }: Props) {
  const [rows, setRows] = useState([
    { 
      meterNo: "",
      meterOwner: "CTUIL", 
      feederName: "", 
      type: "Primary", 
      technology: "AMR", 
      make: "ABB", 
      model: "", 
      fromDate: "",
      locationId: "" 
    },
  ]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...rows];
    // @ts-ignore
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { 
      meterNo: "",
      meterOwner: "CTUIL", 
      feederName: "", 
      type: "Primary", 
      technology: "AMR", 
      make: "ABB", 
      model: "", 
      fromDate: "",
      locationId: "" 
    }]);
  };

  // Row delete karne ka function
  const removeRow = (index: number) => {
    // Ye check karega ki kam se kam 1 row bachi rahe
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    setFormData({ meters: rows });
  }, [rows, setFormData]);

  return (
    <div id="meterdetails">
      <SectionCard title="Section F - Meter Details">
        <div className="space-y-4">
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse min-w-[1150px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-3 py-3 border-r">Meter No. *</th>
                  <th className="px-3 py-3 border-r">Owner</th>
                  <th className="px-3 py-3 border-r">Feeder Name</th>
                  <th className="px-3 py-3 border-r">Type</th>
                  <th className="px-3 py-3 border-r">Tech</th>
                  <th className="px-3 py-3 border-r">Make</th>
                  <th className="px-3 py-3 border-r">Model</th>
                  <th className="px-3 py-3 border-r">From Date</th>
                  <th className="px-3 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-2 border-r">
                      <input className="w-full p-1.5 text-[12px] border rounded-md" placeholder="MTR001" value={row.meterNo} onChange={(e) => handleChange(index, "meterNo", e.target.value)} />
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full p-1.5 text-[12px] border rounded-md" value={row.meterOwner} onChange={(e) => handleChange(index, "meterOwner", e.target.value)}>
                        <option value="CTUIL">CTUIL</option><option value="STU">STU</option>
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <input className="w-full p-1.5 text-[12px] border rounded-md" placeholder="Feeder Name" value={row.feederName} onChange={(e) => handleChange(index, "feederName", e.target.value)} />
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full p-1.5 text-[12px] border rounded-md" value={row.type} onChange={(e) => handleChange(index, "type", e.target.value)}>
                        <option value="Primary">Primary</option><option value="Check">Check</option><option value="Standby">Standby</option>
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full p-1.5 text-[12px] border rounded-md" value={row.technology} onChange={(e) => handleChange(index, "technology", e.target.value)}>
                        <option value="AMR">AMR</option><option value="Non-AMR">Non-AMR</option>
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <select className="w-full p-1.5 text-[12px] border rounded-md" value={row.make} onChange={(e) => handleChange(index, "make", e.target.value)}>
                        <option value="ABB">ABB</option><option value="Secure">Secure</option><option value="L&T">L&T</option>
                      </select>
                    </td>
                    <td className="p-2 border-r">
                      <input className="w-full p-1.5 text-[12px] border rounded-md" placeholder="Model" value={row.model} onChange={(e) => handleChange(index, "model", e.target.value)} />
                    </td>
                    <td className="p-2 border-r">
                      <input type="date" className="w-full p-1.5 text-[11px] border rounded-md" value={row.fromDate} onChange={(e) => handleChange(index, "fromDate", e.target.value)} />
                    </td>

                    {/* LAST ME CROSS BUTTON */}
                    <td className="p-2 text-center">
                      {rows.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          className="bg-red-50 text-red-500 hover:bg-red-100 w-8 h-8 rounded-full flex items-center justify-center transition-all font-bold text-lg shadow-sm border border-red-100"
                        >
                          ×
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={addRow} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-[13px] font-bold mt-2">
            <span className="text-xl">+</span> ADD ANOTHER METER ROW
          </button>
        </div>
      </SectionCard>
    </div>
  );
}