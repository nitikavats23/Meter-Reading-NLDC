"use client";
import React from "react";
import SectionCard from "@/components/SectionCard";
import { FormDataType } from "@/types/form";

type Props = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

export default function UserPrivileges({ formData, setFormData }: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "userType") {
      setFormData((prev) => ({
        ...prev,
        userType: value,
        role: "",
        qcaDetails:
          value === "QCA"
            ? prev.qcaDetails || {
                licenseNumber: "",
                managedStations: "",
              }
            : undefined, // ✅ removed for non-QCA
      }));
    }

    if (name === "role") {
      setFormData((prev) => ({
        ...prev,
        role: value,
      }));
    }
  };

  const getRoleOptions = (): string[] => {
    const type = formData.userType;

    if (type === "NLDC" || type === "RLDC") {
      return [
        "RLDC Admin",
        "RLDC Co-ordinator",
        "RLDC User",
        "RLDC Analyst",
      ];
    }

    if (["OWNER", "SUBSTATION", "QCA"].includes(type)) {
      return ["User"];
    }

    return [];
  };

  const roles = getRoleOptions();

  return (
    <SectionCard title="Section A - User Privileges">
      <div className="grid grid-cols-2 gap-8">

        <div>
          <label>User Type *</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="NLDC">NLDC</option>
            <option value="RLDC">RLDC</option>
            <option value="OWNER">Owner</option>
            <option value="SUBSTATION">Substation</option>
            <option value="QCA">QCA</option>
          </select>
        </div>

        <div>
          <label>Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={!formData.userType}
          >
            <option value="">Select</option>
            {roles.map((r) => (
              <option
                key={r}
                value={r.toLowerCase().replace(/\s+/g, "")}
              >
                {r}
              </option>
            ))}
          </select>
        </div>

      </div>
    </SectionCard>
  );
}