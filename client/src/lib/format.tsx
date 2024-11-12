import { cn } from "@/lib/utils";

export const formatCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  return Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(value);
};

export function renderCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {},
  className?: HTMLSpanElement["className"],
) {
  return (
    <span
      className={cn(
        "inline-block first-letter:align-top first-letter:text-xs first-letter:tracking-[0.1rem] first-letter:text-muted-foreground",
        className,
      )}
    >
      {formatCurrency(value, options)}
    </span>
  );
}
