"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

/*  Props */
type Props = {
  setFormData: React.Dispatch<
    React.SetStateAction<FormDataType>
  >;
};

export default function AccountManager({ setFormData }: Props) {
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [primaryemail, setPrimaryemail] = useState("");
  const [altemail, setAltemail] = useState("");
  const [fullname, setFullname] = useState("");
  const [designation, setDesignation] = useState("");

  const phoneValid = /^[6-9]\d{9}$/.test(phone);
  const altPhoneValid =
    altPhone === "" || /^[6-9]\d{9}$/.test(altPhone);

  /* PUSH DATA TO PARENT */
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      accountManager: {
        fullName: fullname,
        designation,
        email: primaryemail,
        altEmail: altemail,
        phone,
        altPhone,
      },
    }));
  }, [
    fullname,
    designation,
    primaryemail,
    altemail,
    phone,
    altPhone,
    setFormData,
  ]);

  return (
    <div id="accountmanager">
      <SectionCard title="Section B - Account Manager">
        <div className="grid md:grid-cols-2 gap-5">

          {/* Full Name */}
          <div>
            <label>Full Name *</label>
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

          {/* Primary Email */}
          <div>
            <label>Primary Email *</label>
            <input
              type="email"
              className="w-full border p-3 rounded"
              value={primaryemail}
              onChange={(e) => setPrimaryemail(e.target.value)}
            />
          </div>

          {/* Alternate Email */}
          <div>
            <label>Alternate Email</label>
            <input
              type="email"
              className="w-full border p-3 rounded"
              value={altemail}
              onChange={(e) => setAltemail(e.target.value)}
            />
          </div>

          {/* Contact Number */}
          <div>
            <label>Contact Number *</label>
            <input
              className="w-full border p-3 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {phone && !phoneValid && (
              <p className="text-red-500 text-sm">
                10 digit valid mobile number
              </p>
            )}
          </div>

          {/* Alternate Contact */}
          <div>
            <label>Alternate Contact</label>
            <input
              className="w-full border p-3 rounded"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
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