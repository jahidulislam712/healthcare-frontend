/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Check, ChevronDown, Search, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const specialtyIcons = [
  "Stethoscope",
  "HeartPulse",
  "Brain",
  "Bone",
  "Baby",
  "Eye",
  "Ear",
  "Smile",
  "ScanFace",
  "Ribbon",
  "Activity",
  "Scan",
  "Scissors",
  "Syringe",
  "Pill",
  "Microscope",
  "Dna",
  "Thermometer",
  "Hospital",
  "HandHeart",
  "Flower2"
] as const;

interface SpecialtyIconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function SpecialtyIconPicker({
  value,
  onChange,
}: SpecialtyIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = specialtyIcons.filter((icon) =>
    icon.toLowerCase().includes(search.toLowerCase()),
  );

  const SelectedIcon =
    (LucideIcons as any)[value] || Stethoscope;

  return (
    <div className="space-y-3">
      <Label>Specialty Icon</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
            >
              <span className="flex items-center gap-2">
                <SelectedIcon className="size-4 text-primary" />
                {value || "Choose an icon"}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          }
        />

        <PopoverContent className="w-72 p-2" align="start">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>

          <div className="grid max-h-52 grid-cols-5 gap-1 overflow-y-auto">
            {filteredIcons.map((iconName) => {
              const Icon = (LucideIcons as any)[iconName];
              const selected = value === iconName;

              return (
                <Button
                  key={iconName}
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={iconName}
                  className={cn(
                    "relative size-10",
                    selected && "bg-primary/10 text-primary",
                  )}
                  onClick={() => {
                    onChange(iconName);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Icon className="size-5" />
                  {selected && (
                    <Check className="absolute right-0 top-0 size-3" />
                  )}
                </Button>
              );
            })}
          </div>

          {filteredIcons.length === 0 && (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No icons found.
            </p>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}