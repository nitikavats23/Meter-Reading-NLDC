"use client";

import { useState } from "react";
import SectionCard from "./SectionCard";

export default function MeterDetails() {
  const [rows, setRows] = useState([{ meterNo: "", owner: "" }]);

  const addRow = () => {
    setRows([...rows, { meterNo: "", owner: "" }]);
  };

  return (
    <SectionCard title="Meter Details">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Meter Number</th>
            <th className="border p-2">Meter Owner</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border p-2">
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="Enter Meter No"
                />
              </td>

              <td className="border p-2">
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  placeholder="Enter Owner Name"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={addRow}
        className="mt-4 bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Add Meter
      </button>
    </SectionCard>
  );
}