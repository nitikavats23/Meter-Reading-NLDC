"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";

export default function AssociateManager() {
  const [phone, setPhone] = useState("");

  const phoneValid =
    phone === "" || /^[6-9]\d{9}$/.test(phone);

  return (
    <div id="associatemanager">
    <SectionCard title="Section D - Associate Manager">
      <div className="grid md:grid-cols-2 gap-5">

        <input
          className="border p-3 rounded"
          placeholder="Associate Full Name"
        />

        <input
          className="border p-3 rounded"
          placeholder="Designation"
        />

        <input
          type="email"
          className="border p-3 rounded"
          placeholder="Associate Email"
        />

        <div>
          <input
            className="w-full border p-3 rounded"
            placeholder="Associate Contact"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          {phone && !phoneValid && (
            <p className="text-red-500 text-sm">
              Invalid mobile number
            </p>
          )}
        </div>

      </div>
    </SectionCard>
    </div>
  );
}