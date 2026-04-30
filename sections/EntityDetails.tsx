"use client";
import SectionCard from "@/components/SectionCard";

export default function EntityDetails({ formData, setFormData }: any) {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      entity: {
        ...formData.entity,
        [e.target.name]: e.target.value,
      },
    });
  };

  const rldcOptions = ["NLDC", "NRLDC", "WRLDC", "ERLDC", "SRLDC", "NERLDC"];

  return (
    <SectionCard title="Section D - Entity Details">
      <div className="grid grid-cols-2 gap-8">
        
        {/* Field 1: Entity Owner (Fixed Value) */}
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

        {/* Field 2: RLDC Dropdown */}
        <div>
          <label className="block mb-1.5 text-[12px] font-bold text-slate-800 uppercase tracking-wide">
            RLDC <span className="text-red-500 font-bold">*</span>
          </label>
          <select
            name="rldc"
            value={formData.entity?.rldc || ""}
            onChange={handleChange}
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

      </div>
    </SectionCard>
  );
}