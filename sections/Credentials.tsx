import SectionCard from "@/components/SectionCard";
import InputField from "@/components/InputField";

export default function Credentials() {
  return (
    <SectionCard title="Credentials">
      <div className="grid md:grid-cols-3 gap-5">
        <InputField label="Username" placeholder="Enter username" />
        <InputField label="Password" placeholder="Enter password" />
        <InputField label="Confirm Password" placeholder="Confirm password" />
      </div>
    </SectionCard>
  );
}