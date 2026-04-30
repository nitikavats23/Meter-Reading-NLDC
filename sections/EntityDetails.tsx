"use client";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  formData: FormDataType;
  setFormData: (partial: Partial<FormDataType>) => void;
};

export default function EntityDetails({ formData, setFormData }: Props) {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      entity: {
        ...formData.entity,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      entity: {
        ...formData.entity,
        [e.target.name]: e.target.value,
      },
    });
  };

  const rldcOptions = ["NLDC", "NRLDC", "WRLDC", "ERLDC", "SRLDC", "NERLDC"];
  const isRLDC = formData.userType === "RLDC";

  return (
    <SectionCard title="Section D - Entity Details">
      <div className="grid grid-cols-2 gap-8">

        {/* Field 1: Entity Owner (Fixed Value - always shown) */}
        <div>
          <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
            Entity Owner <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="text"
            value="GRID India"
            disabled
            className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] text-slate-500 font-bold bg-gray-50 cursor-not-allowed outline-none"
          />
          <p className="mt-1 text-[10px] text-slate-400 italic font-medium">
            Note: Entity owner is fixed to GRID India.
          </p>
        </div>

        {/* Field 2: RLDC Dropdown (only for RLDC user type) */}
        {isRLDC ? (
          <div>
            <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
              RLDC <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              name="rldc"
              value={formData.entity?.rldc || ""}
              onChange={handleSelectChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-semibold outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all bg-white cursor-pointer"
            >
              <option value="">Select RLDC</option>
              {rldcOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            {/* Entity Name */}
            <div>
              <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
                Entity Name <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="entityName"
                value={formData.entity?.entityName || ""}
                onChange={handleInputChange}
                placeholder="Enter entity name"
                className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Owner Email */}
            <div>
              <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
                Owner Email <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="email"
                name="ownerEmail"
                value={formData.entity?.ownerEmail || ""}
                onChange={handleInputChange}
                placeholder="Enter owner email"
                className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Owner Contact No */}
            <div>
              <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
                Owner Contact No <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="ownerPhone"
                value={formData.entity?.ownerPhone || ""}
                onChange={handleInputChange}
                placeholder="Enter owner contact number"
                className="w-full border border-gray-300 p-2.5 rounded-lg text-[13px] text-slate-700 font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all"
              />
            </div>
          </>
        )}

      </div>
    </SectionCard>
  );
}