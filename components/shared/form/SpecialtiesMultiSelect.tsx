"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { ISpecialty } from "@/app/types/specialty.types";

type SpecialtiesMultiSelectProps = {
  options: ISpecialty[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export function SpecialtiesMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select specialties",
}: SpecialtiesMultiSelectProps) {
  const selected = options.filter((option) => value.includes(option.id));

  const toggleSpecialty = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((item) => item !== id) : [...value, id],
    );
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between font-normal"
          >
            <span className="truncate">
              {selected.length > 0
                ? selected.map((item) => item.title).join(", ")
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        }
      />

      <PopoverContent className="w-(--radix-popover-trigger-width) p-2">
        <div className="max-h-60 space-y-1 overflow-y-auto">
          {options.length === 0 ? (
            <p className="p-2 text-sm text-muted-foreground">
              No specialties available.
            </p>
          ) : (
            options.map((option) => {
              const checked = value.includes(option.id);

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleSpecialty(option.id)}
                  className="flex w-full items-center gap-2 rounded-sm p-2 text-left text-sm hover:bg-accent"
                >
                  <Checkbox checked={checked} />
                  <span className="flex-1">{option.title}</span>
                  {checked && <Check className="size-4" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
