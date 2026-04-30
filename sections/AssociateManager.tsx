"use client";

import { useState, useEffect } from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function AssociateManager({ setFormData }: Props) {
  const [fullname, setFullname] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const phoneValid = phone === "" || /^[6-9]\d{9}$/.test(phone);

  useEffect(() => {
    setFormData({
      associateManagers: [
        {
          name: fullname,
          designation,
          email,
          phone,
        },
      ],
    });
  }, [fullname, designation, email, phone]);

  return (
    <div id="associatemanager">
      <SectionCard title="Section E - Associate Manager (Optional)">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Full Name */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Associate Full Name
            </label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="Enter associate's full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Designation
            </label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="e.g. Assistant Manager"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Associate Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="associate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              Associate Contact
            </label>
            <input
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {phone && !phoneValid && (
              <p className="text-red-500 text-[11px] mt-1 font-semibold italic">
                ! Invalid mobile number
              </p>
            )}
          </div>

        </div>
      </SectionCard>
    </div>
  );
}