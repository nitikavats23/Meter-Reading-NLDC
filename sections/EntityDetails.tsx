"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";

export default function EntityDetails() {
  const [ownerPhone, setOwnerPhone] =
    useState("");

  const phoneValid =
    /^[6-9]\d{9}$/.test(ownerPhone);

  return (
    <div id="entitydetails">
    <SectionCard title="Section C - Entity Details">
      <div className="grid md:grid-cols-2 gap-5">

        <input
          className="border p-3 rounded"
          placeholder="Entity Name"
        />

        <input
          className="border p-3 rounded"
          placeholder="Substation"
        />

        <input
          className="border p-3 rounded"
          placeholder="Entity Owner"
        />

        <input
          type="email"
          className="border p-3 rounded"
          placeholder="Owner Email"
        />

        <div>
          <input
            className="w-full border p-3 rounded"
            placeholder="Owner Contact"
            value={ownerPhone}
            onChange={(e) =>
              setOwnerPhone(e.target.value)
            }
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