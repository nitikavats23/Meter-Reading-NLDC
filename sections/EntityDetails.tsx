import SectionCard from "@/components/SectionCard";
import InputField from "@/components/InputField";

export default function EntityDetails() {
  return (
    <SectionCard title="Entity Details">
      <div className="grid md:grid-cols-2 gap-5">
        <InputField label="Entity Name" placeholder="Company name" />
        <InputField label="Owner Email" placeholder="owner@email.com" />
        <InputField label="Substation" placeholder="Enter substation" />
        <InputField label="Owner Contact" placeholder="Phone number" />
      </div>
    </SectionCard>
  );
}