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

export default function EntityDetails({ setFormData }: Props) {
  const [entityName, setEntityName] = useState("");
  const [substation, setSubstation] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const phoneValid = /^[6-9]\d{9}$/.test(ownerPhone);

  /* ✅ PUSH DATA TO PARENT */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      entity: {
        entityName,
        substation,
        ownerName,
        ownerEmail,
        ownerPhone,
      },
    }));
  }, [
    entityName,
    substation,
    ownerName,
    ownerEmail,
    ownerPhone,
    setFormData,
  ]);

  return (
    <div id="entitydetails">
      <SectionCard title="Section C - Entity Details">
        <div className="grid md:grid-cols-2 gap-5">

          {/* Entity Name */}
          <div>
            <label>Entity Name *</label>
            <input
              className="w-full border p-3 rounded"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
            />
          </div>

          {/* Substation */}
          <div>
            <label>Substation *</label>
            <input
              className="w-full border p-3 rounded"
              value={substation}
              onChange={(e) => setSubstation(e.target.value)}
            />
          </div>

          {/* Owner Name */}
          <div>
            <label>Entity Owner *</label>
            <input
              className="w-full border p-3 rounded"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>

          {/* Owner Email */}
          <div>
            <label>Owner Email *</label>
            <input
              type="email"
              className="w-full border p-3 rounded"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </div>

          {/* Owner Contact */}
          <div>
            <label>Owner Contact *</label>
            <input
              className="w-full border p-3 rounded"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
            />

            {ownerPhone && !phoneValid && (
              <p className="text-red-500 text-sm">
                10 digit valid number
              </p>
            )}
          </div>

        </div>
      </SectionCard>
    </div>
  );
}