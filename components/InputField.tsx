type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
};

export default function InputField({
  label,
  type = "text",
  placeholder,
}: InputFieldProps) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>

      <input
        type={type}
        placeholder={placeholder || `Enter ${label}`}
        className="w-full border p-3 rounded-lg"
      />
    </div>
  );
}