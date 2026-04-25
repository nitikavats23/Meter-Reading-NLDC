import SectionCard from "@/components/SectionCard";
import InputField from "@/components/InputField";

export default function AccountManager() {
  return (
    <SectionCard title="Account Manager Details">
      <div className="grid md:grid-cols-2 gap-5">
        <InputField label="Full Name" placeholder="Enter name" />
        <InputField label="Email" placeholder="Enter email" />
        <InputField label="Contact Number" placeholder="Phone number" />
        <InputField label="Designation" placeholder="Job title" />
      </div>
    </SectionCard>
  );
}