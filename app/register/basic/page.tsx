"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  userType: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  userType?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};

export default function Step1() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    userType: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err: FormErrors = {};

    if (!form.userType) err.userType = "User type is required";

    if (!form.username || form.username.length < 5)
      err.username = "Username must be at least 5 characters";

    if (!form.password || form.password.length < 8)
      err.password = "Password must be at least 8 characters";

    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  //  SAVE DRAFT
  const handleSaveDraft = () => {
    localStorage.setItem("step1_draft", JSON.stringify(form));
    alert("Draft saved successfully!");
  };

  //  NEXT
  const handleNext = () => {
    if (!validate()) return;

    localStorage.setItem("step1", JSON.stringify(form));
    router.push("http://localhost:3000/register/accountmanager");
  };

  const isDisabled =
    !form.userType ||
    !form.username ||
    !form.password ||
    !form.confirmPassword;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            Step 1: Basic Credentials
          </p>
        </div>

        {/* USER TYPE */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            User Type *
          </label>
          <select
            name="userType"
            value={form.userType}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select user type</option>
            <option value="Station">Station</option>
            <option value="QCA">QCA</option>
            <option value="Owner">Owner</option>
            <option value="AMR">AMR</option>
          </select>
          {errors.userType && (
            <p className="text-red-500 text-sm mt-1">{errors.userType}</p>
          )}
        </div>

        {/* USERNAME */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Username *
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
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