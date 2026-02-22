import { forwardRef } from "react";

import { formatPhone, normalizePhone } from "@/shared/lib/phone";

type PhoneInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> & {
  value: string;
  onChange: (value: string) => void;
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({ value, onChange, ...props }, ref) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(normalizePhone(event.target.value));
  };

  return (
    <input
      {...props}
      ref={ref}
      type="tel"
      inputMode="numeric"
      autoComplete={props.autoComplete ?? "tel"}
      value={formatPhone(value)}
      onChange={handleChange}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
