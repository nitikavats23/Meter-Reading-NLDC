import SectionCard from "@/components/SectionCard";
import InputField from "@/components/InputField";

export default function QCADetails() {
  return (
    <SectionCard title="QCA Details">
      <div className="grid md:grid-cols-2 gap-5">
        <InputField label="QCA License No." placeholder="Enter license no." />
        <InputField label="Mapped Stations" placeholder="Stations count" />
      </div>
    </SectionCard>
  );
}