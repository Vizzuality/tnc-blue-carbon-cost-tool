"use client";

import * as React from "react";
import { useState } from "react";

import { SearchIcon, XIcon } from "lucide-react";
import { useDebounce } from "rooks";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";

export default function Search({
  placeholder,
  onChange,
  onClose,
  className,
  autoFocus = false,
  showCloseIconAlways = false,
  defaultValue = "",
}: {
  placeholder?: string;
  onChange: (v: string | undefined) => void;
  onClose?: () => void;
  className?: HTMLDivElement["className"] | undefined;
  autoFocus?: HTMLInputElement["autofocus"] | undefined;
  showCloseIconAlways?: boolean | undefined;
  defaultValue?: string | undefined;
}) {
  const [value, setValue] = useState(defaultValue);

  const debouncedOnChange = useDebounce((value: string | undefined) => {
    onChange(value);
  }, 150);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <SearchIcon className="text-grey-900 h-6 w-6" />
      <div className="flex w-full">
        <div className="relative">
          <Input
            variant="ghost"
            className="w-[325px] pl-3 pr-8"
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
              "text-grey-800 hover:text-grey-900 absolute right-2 top-1/2 block h-6 w-6 -translate-y-[calc(50%+2px)] p-1 focus:outline-none",
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
            <XIcon className="h-5 w-5 text-current hover:text-muted-foreground" />
          </span>
        </div>
      </div>
    </div>
  );
}
