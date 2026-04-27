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
            <label className="block mb-1 font-medium">Entity Name *</label>
            <input
              className="w-full border p-3 rounded"
              placeholder="Enter Company or Entity Name" // Updated placeholder
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
            />
          </div>

          {/* Substation */}
          <div>
            <label className="block mb-1 font-medium">Substation *</label>
            <input
              className="w-full border p-3 rounded"
              placeholder="Enter Substation Name or ID" // Updated placeholder
              value={substation}
              onChange={(e) => setSubstation(e.target.value)}
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block mb-1 font-medium">Entity Owner *</label>
            <input
              className="w-full border p-3 rounded"
              placeholder="Full Name of the Owner" // Updated placeholder
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>

          {/* Owner Email */}
          <div>
            <label className="block mb-1 font-medium">Owner Email *</label>
            <input
              type="email"
              className="w-full border p-3 rounded"
              placeholder="owner.email@example.com" // Updated placeholder
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </div>

          {/* Owner Contact */}
          <div>
            <label className="block mb-1 font-medium">Owner Contact *</label>
            <input
              className="w-full border p-3 rounded"
              placeholder="e.g. 9876543210" // Example placeholder
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
            />

            {ownerPhone && !phoneValid && (
              <p className="text-red-500 text-sm mt-1">
                10 digit valid mobile number
              </p>
            )}
          </div>

        </div>
      </SectionCard>
    </div>
  );
}