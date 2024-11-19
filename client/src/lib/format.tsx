import { cn } from "@/lib/utils";

export const formatCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(value);
};

/**
 * Parses a currency value into its symbol and amount components
 * @param value - The numeric value to parse
 * @param options - Optional Intl.NumberFormatOptions for currency formatting
 * @returns A tuple containing [currencySymbol, amount] as strings
 * @example
 * parseCurrency(1234.56) // returns ['$', '1,234']
 */
export const parseCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  let formatted = formatCurrency(value, options);
  formatted = formatted.replace(/\.\d+/, "");
  const [symbol, amount] = formatted.match(/^(\D*)(.+)$/)!.slice(1);
  return [symbol.trim(), amount];
};

export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  return Intl.NumberFormat("en-US", {
    style: "decimal",
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
