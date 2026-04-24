"use client";

import { useForm } from "react-hook-form";

export default function AssociateManagerPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: unknown) => {
    console.log("Associate Manager Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Associate Manager Details
        </h1>

        {/* Associate Name */}
        <div>
          <label className="block text-sm font-medium">
            Associate Name *
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter associate name"
            {...register("associateName", {
              required: "Associate name is required",
            })}
          />
          {errors.associateName && (
            <p className="text-red-500 text-sm">
              {errors.associateName.message as string}
            </p>
          )}
        </div>

        {/* Associate Designation */}
        <div>
          <label className="block text-sm font-medium">
            Associate Designation *
          </label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter designation"
            {...register("associateDesignation", {
              required: "Designation is required",
            })}
          />
          {errors.associateDesignation && (
            <p className="text-red-500 text-sm">
              {errors.associateDesignation.message as string}
            </p>
          )}
        </div>

        {/* Associate Email */}
        <div>
          <label className="block text-sm font-medium">
            Associate Email *
          </label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Enter email"
            {...register("associateEmail", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
          />
          {errors.associateEmail && (
            <p className="text-red-500 text-sm">
              {errors.associateEmail.message as string}
            </p>
          )}
        </div>

        {/* Associate Contact */}
        <div>
          <label className="block text-sm font-medium">
            Associate Contact *
          </label>
          <input
            type="tel"
            className="w-full border p-2 rounded"
            placeholder="10-digit number"
            {...register("associateContact", {
              required: "Contact is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter valid 10-digit number",
              },
            })}
          />
          {errors.associateContact && (
            <p className="text-red-500 text-sm">
              {errors.associateContact.message as string}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}