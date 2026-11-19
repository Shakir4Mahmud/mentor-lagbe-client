"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: string[];
  icon: LucideIcon;
};

export default function FilterSelect({
  value,
  onChange,
  allLabel,
  options,
  icon,
}: FilterSelectProps) {
  const Icon = icon;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Bahire click korle ba Escape chaple dropdown bondho hobe
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const wrapper = wrapperRef.current;
      if (wrapper && !wrapper.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(newValue: string) {
    onChange(newValue);
    setOpen(false);
  }

  let buttonLabel = allLabel;
  if (value !== "") {
    buttonLabel = value;
  }

  let buttonClass =
    "flex h-11 w-full items-center justify-between gap-2 rounded-xl border px-3 text-sm transition ";
  if (open) {
    buttonClass = buttonClass + "border-primary bg-background ring-2 ring-ring/30 ";
  } else if (value !== "") {
    buttonClass = buttonClass + "border-primary/50 bg-secondary font-medium text-primary ";
  } else {
    buttonClass = buttonClass + "bg-background hover:border-primary/50 ";
  }

  let chevronClass = "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200";
  if (open) {
    chevronClass = chevronClass + " rotate-180";
  }

  // "All" option ke list er prothome rakhbo
  const allOptions = ["", ...options];

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={buttonClass}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{buttonLabel}</span>
        </span>
        <ChevronDown className={chevronClass} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border bg-card p-1.5 shadow-xl shadow-black/20"
          >
            {allOptions.map((option) => {
              const isSelected = option === value;

              let optionLabel = option;
              if (option === "") {
                optionLabel = allLabel;
              }

              let optionClass =
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ";
              if (isSelected) {
                optionClass = optionClass + "bg-secondary font-medium text-primary";
              } else {
                optionClass = optionClass + "hover:bg-muted";
              }

              return (
                <button
                  key={optionLabel}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={optionClass}
                >
                  {optionLabel}
                  {isSelected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}