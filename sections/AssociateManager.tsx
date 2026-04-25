import SectionCard from "@/components/SectionCard";
import InputField from "@/components/InputField";

export default function AssociateManager() {
  return (
    <SectionCard title="Associate Account Manager Details">
      <div className="grid md:grid-cols-2 gap-5">
        <InputField label="Associate Full Name" />
        <InputField label="Associate Designation" />
        <InputField label="Associate Email" type="email" />
        <InputField label="Associate Contact Number" />
        <InputField label="Department" />
        <InputField label="Employee ID" />
      </div>
    </SectionCard>
  );
}