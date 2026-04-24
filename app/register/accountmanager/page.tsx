"use client";

import { useForm } from "react-hook-form";

export default function AccountManagerProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Account Manager Profile
        </h1>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name *</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter full name"
            {...register("fullName", {
              required: "Full name is required",
            })}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">
              {errors.fullName.message as string}
            </p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium">Designation *</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter designation"
            {...register("designation", {
              required: "Designation is required",
            })}
          />
          {errors.designation && (
            <p className="text-red-500 text-sm">
              {errors.designation.message as string}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Primary Email *</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Enter email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message as string}
            </p>
          )}
        </div>

        {/* Alternate Email */}
        <div>
          <label className="block text-sm font-medium">
            Alternate Email
          </label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Optional"
            {...register("altEmail")}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone *</label>
          <input
            type="tel"
            className="w-full border p-2 rounded"
            placeholder="10-digit number"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10-digit number",
              },
            })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">
              {errors.phone.message as string}
            </p>
          )}
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="block text-sm font-medium">
            Alternate Phone
          </label>
          <input
            type="tel"
            className="w-full border p-2 rounded"
            placeholder="Optional"
            {...register("altPhone")}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}