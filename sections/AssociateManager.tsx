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

export default function AssociateManager({ setFormData }: Props) {
  const [fullname, setFullname] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const phoneValid =
    phone === "" || /^[6-9]\d{9}$/.test(phone);

  /* ✅ PUSH DATA TO PARENT */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      associateManagers: [
        {
          name: fullname,
          designation,
          email,
          phone,
        },
      ],
    }));
  }, [fullname, designation, email, phone, setFormData]);

  return (
    <div id="associatemanager">

      <SectionCard title="Section D - Associate Manager">

        <div className="grid md:grid-cols-2 gap-5">

          {/* Full Name */}
          <div>
            <label>Associate Full Name *</label>
            <input
              className="w-full border p-3 rounded"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          {/* Designation */}
          <div>
            <label>Designation *</label>
            <input
              className="w-full border p-3 rounded"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label>Associate Email *</label>
            <input
              type="email"
              className="w-full border p-3 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Contact */}
          <div>
            <label>Associate Contact *</label>
            <input
              className="w-full border p-3 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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