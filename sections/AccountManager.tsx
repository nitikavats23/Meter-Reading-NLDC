"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

/* ✅ Props Typing */
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

  /* ✅ PUSH DATA TO PARENT */
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
      {/* Title updated to Section C as per your latest page.tsx logic */}
      <SectionCard title="Section C - Account Manager Details">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Full Name */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Full Name <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="Enter full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Designation <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="e.g. Project Manager"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          {/* Primary Email */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Primary Email <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="example@domain.com"
              value={primaryemail}
              onChange={(e) => setPrimaryemail(e.target.value)}
            />
          </div>

          {/* Alternate Email */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Alternate Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="secondary@domain.com"
              value={altemail}
              onChange={(e) => setAltemail(e.target.value)}
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Contact Number <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {phone && !phoneValid && (
              <p className="text-red-500 text-[11px] mt-1 font-semibold italic">
                ! Please enter a valid 10-digit mobile number
              </p>
            )}
          </div>

          {/* Alternate Contact */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Alternate Contact
            </label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="Optional contact number"
              value={altPhone}
              onChange={(e) => setAltPhone(e.target.value)}
            />

            {altPhone && !altPhoneValid && (
              <p className="text-red-500 text-[11px] mt-1 font-semibold italic">
                ! Invalid alternate contact number
              </p>
            )}
          </div>

        </div>
      </SectionCard>
    </div>
  );
}