"use client";

import { useState, useEffect } from "react";
import SectionCard from "./SectionCard";
import { FormDataType } from "@/types/form";

/* ✅ Props */
type Props = {
  setFormData: React.Dispatch<
    React.SetStateAction<FormDataType>
  >;
};

export default function MeterDetails({ setFormData }: Props) {
  const [rows, setRows] = useState([
    { meterNo: "", meterOwner: "" },
  ]);

  /* ✅ Handle input change */
  const handleChange = (
    index: number,
    field: "meterNo" | "meterOwner",
    value: string
  ) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  /* ✅ Add new row */
  const addRow = () => {
    setRows([...rows, { meterNo: "", meterOwner: "" }]);
  };

  /* ✅ PUSH TO PARENT */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      meters: rows,
    }));
  }, [rows, setFormData]);

  return (
    <div id="meterdetails">
      <SectionCard title="Section E - Meter Details">
        <div className="space-y-4">

          {rows.map((row, index) => (
            <div key={index} className="grid md:grid-cols-2 gap-4">

              {/* Meter No */}
              <div>
                <label>Meter No. {index + 1} *</label>
                <input
                  className="w-full border p-3 rounded"
                  value={row.meterNo}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "meterNo",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Meter Owner */}
              <div>
                <label>Meter Owner</label>
                <input
                  className="w-full border p-3 rounded"
                  value={row.meterOwner}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "meterOwner",
                      e.target.value
                    )
                  }
                />
              </div>

            </div>
          ))}

          {/* Add Button */}
          <button
            type="button"
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