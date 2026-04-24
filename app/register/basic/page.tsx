"use client";

import { useState } from "react";

// Types
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

export default function Page() {
  const [form, setForm] = useState<FormData>({
    userType: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Password strength
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "Weak";
    if (score <= 3) return "Medium";
    return "Strong";
  };

  // Validation
  const validate = (): boolean => {
    const err: FormErrors = {};

    if (!form.userType) err.userType = "User type is required";

    if (!form.username || form.username.length < 5) {
      err.username = "Username must be at least 5 characters";
    }

    if (!form.password || form.password.length < 8) {
      err.password = "Password must be at least 8 characters";
    }

    if (form.password !== form.confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Next step
  const handleNext = () => {
    if (validate()) {
      console.log("Step 1 Data:", form);
      alert("Step 1 completed successfully!");
    }
  };

  const isDisabled =
    !form.userType ||
    !form.username ||
    !form.password ||
    !form.confirmPassword;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            Step 1: Basic Credentials
          </p>
        </div>

        {/* User Type */}
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

        {/* Username */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Username *
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="w-full border rounded-lg p-2 mt-1 placeholder-gray-500 text-gray-800 focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        {/* Password */}
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

          {form.password && (
            <p className="text-sm mt-1 text-gray-600">
              Strength:{" "}
              <span className="font-medium">
                {getStrength(form.password)}
              </span>
            </p>
          )}

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
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

          {form.confirmPassword && (
            <p className="text-sm mt-1">
              {form.password === form.confirmPassword
                ? "Passwords match ✔"
                : "Passwords do not match "}
            </p>
          )}

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleNext}
          disabled={isDisabled}
          className={`w-full py-2 rounded-lg text-white font-medium ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}