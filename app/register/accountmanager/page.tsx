"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  fullname: string;
  designation: string;
  primaryemail: string;
  alternateemail: string;
  phonenumber: string;
  alternatephonenumber: string;
};

type FormErrors = {
  fullname?: string;
  designation?: string;
  primaryemail?: string;
  phonenumber?: string;
};

export default function Page() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    fullname: "",
    designation: "",
    primaryemail: "",
    alternateemail: "",
    phonenumber: "",
    alternatephonenumber: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err: FormErrors = {};

    if (!form.fullname) err.fullname = "Full name is required";
    if (!form.designation) err.designation = "Designation is required";
    if (!form.primaryemail) err.primaryemail = "Email is required";

    if (!/^[0-9]{10}$/.test(form.phonenumber)) {
      err.phonenumber = "Phone must be 10 digits";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      console.log("Step 1 Data:", form);
      router.push("/next-page");
    }
  };

  //  SAVE DRAFT
  const handleSaveDraft = () => {
    localStorage.setItem("step1_draft", JSON.stringify(form));
    alert("Draft saved successfully!");
  };


  const isDisabled =
    !form.fullname ||
    !form.designation ||
    !form.primaryemail ||
    !form.phonenumber;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">

        {/* HEADER (UPDATED STEP TEXT) */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Account Manager Profile
          </h1>
          <p className="text-sm text-gray-500">
            Step 2: Provide details of the primary account holder
          </p>
        </div>

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Enter full name"
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Designation *
          </label>
          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Enter designation"
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          {errors.designation && (
            <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
          )}
        </div>

        {/* Primary Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Primary Email *
          </label>
          <input
            name="primaryemail"
            value={form.primaryemail}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          {errors.primaryemail && (
            <p className="text-red-500 text-sm mt-1">
              {errors.primaryemail}
            </p>
          )}
        </div>

        {/* Alternate Email  */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Alternate Email
          </label>
          <input
            name="alternateemail"
            value={form.alternateemail}
            onChange={handleChange}
            placeholder="Optional alternate email"
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            name="phonenumber"
            value={form.phonenumber}
            onChange={handleChange}
            placeholder="10-digit number"
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          {errors.phonenumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phonenumber}
            </p>
          )}
        </div>

        {/* Alternate Phone  */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Alternate Phone Number
          </label>
          <input
            name="alternatephonenumber"
            value={form.alternatephonenumber}
            onChange={handleChange}
            placeholder="Optional alternate number"
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* BUTTONS */}
        <div className="flex gap-3">

          {/* SAVE DRAFT */}
          <button
            onClick={handleSaveDraft}
            className="w-1/2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
          >
            Save Draft
          </button>


          {/* NEXT */}
          <button
            onClick={handleNext}
            disabled={isDisabled}
            className={`w-1/2 py-2 rounded-lg text-white font-medium ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
