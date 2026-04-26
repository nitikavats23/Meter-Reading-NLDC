"use client";

import { useState } from "react";
import SectionCard from "@/components/SectionCard";

export default function AccountManager() {
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");

  const phoneValid = /^[6-9]\d{9}$/.test(phone);
  const altPhoneValid =
    altPhone === "" || /^[6-9]\d{9}$/.test(altPhone);

  return (
    <div id="accountmanager">
     <SectionCard title="Section B - Account Manager">
      <div className="grid md:grid-cols-2 gap-5">

        <input className="border p-3 rounded" placeholder="Full Name" />
        <input className="border p-3 rounded" placeholder="Designation" />

        <input
          type="email"
          className="border p-3 rounded"
          placeholder="Primary Email"
        />

        <input
          type="email"
          className="border p-3 rounded"
          placeholder="Alternate Email"
        />

        <div>
          <input
            className="w-full border p-3 rounded"
            placeholder="Contact Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />
          {phone && !phoneValid && (
            <p className="text-red-500 text-sm">
              10 digit valid mobile number
            </p>
          )}
        </div>

        <div>
          <input
            className="w-full border p-3 rounded"
            placeholder="Alternate Contact"
            value={altPhone}
            onChange={(e) =>
              setAltPhone(e.target.value)
            }
          />
          {altPhone && !altPhoneValid && (
            <p className="text-red-500 text-sm">
              Invalid number
            </p>
          )}
        </div>

      </div>
    
    </SectionCard>
    </div>
  );
}