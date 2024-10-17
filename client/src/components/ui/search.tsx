"use client";

import * as React from "react";
import { useState } from "react";

import { SearchIcon, SearchX } from "lucide-react";
import { useDebounce } from "rooks";

import { cn } from "@/lib/utils";

export default function Search({
  placeholder,
  onChange,
  onClose,
  className,
  autoFocus = false,
  showCloseIconAlways = false,
}: {
  placeholder?: string;
  onChange: (v: string | undefined) => void;
  onClose?: () => void;
  className?: HTMLDivElement["className"] | undefined;
  autoFocus?: HTMLInputElement["autofocus"] | undefined;
  showCloseIconAlways?: boolean | undefined;
}) {
  const [value, setValue] = useState("");

  const debouncedOnChange = useDebounce((value: string | undefined) => {
    onChange(value);
  }, 150);

  return (
    <div className={cn("flex", className)}>
      <SearchIcon className="text-grey-900 h-6 w-6" />
      <div className="relative flex w-full">
        <input
          className={cn(
            "placeholder:text-grey-600 flex w-[345px] items-center bg-white pl-6 pr-6 focus:outline-none",
          )}
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            debouncedOnChange(e.target.value);
          }}
          value={value}
          autoFocus={autoFocus}
        />

        <span
          role="button"
          className={cn(
            "text-grey-800 hover:text-grey-900 absolute right-0 block h-6 w-6 p-1 focus:outline-none",
            {
              hidden: value === "" && !showCloseIconAlways,
            },
          )}
          onClick={() => {
            setValue("");
            debouncedOnChange(undefined);
            onClose?.();
          }}
        >
          <SearchX className="text-current" />
        </span>
      </div>
    </div>
  );
}
