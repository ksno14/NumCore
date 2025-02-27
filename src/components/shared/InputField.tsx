type InputFieldProps = {
  label: string | React.ReactNode;
  type: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  step?: number | string;
  min?: number;
  max?: number;
};

export default function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  step,
  min,
  max,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
      />
    </div>
  );
}
