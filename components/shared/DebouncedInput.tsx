import { useDebouncedCallback } from "@tanstack/react-pacer/debouncer";
import { ComponentProps, useState } from "react";
import { Input } from "../ui/input";

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<ComponentProps<typeof Input>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  const debouncedOnChange = useDebouncedCallback(onChange, {
    wait: debounce,
  });

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedOnChange(newValue);
      }}
    />
  );
}

export default DebouncedInput;