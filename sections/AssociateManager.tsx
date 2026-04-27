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

      {/* Heading mein bracket mein optional add kar diya hai */}
      <SectionCard title="Section D - Associate Manager (Optional)">

        <div className="grid md:grid-cols-2 gap-5">

          {/* Full Name */}
          <div>
            <label className="block mb-1 font-medium">Associate Full Name</label>
            <input
              className="w-full border p-3 rounded"
              placeholder="Enter associate's full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block mb-1 font-medium">Designation</label>
            <input
              className="w-full border p-3 rounded"
              placeholder="e.g. Assistant Manager"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Associate Email</label>
            <input
              type="email"
              className="w-full border p-3 rounded"
              placeholder="associate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-1 font-medium">Associate Contact</label>
            <input
              className="w-full border p-3 rounded"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {phone && !phoneValid && (
              <p className="text-red-500 text-sm mt-1">
                Invalid mobile number
              </p>
            )}
          </div>

        </div>

      </SectionCard>

    </div>
  );
}