import { useDebouncedCallback } from "@tanstack/react-pacer/debouncer";
import { ComponentProps, useState, useEffect } from "react";
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

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedOnChange = useDebouncedCallback(onChange, { wait: debounce });

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        debouncedOnChange(e.target.value);
      }}
    />
  );
}
export default DebouncedInput;
