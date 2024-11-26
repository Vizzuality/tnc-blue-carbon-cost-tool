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

export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  return Intl.NumberFormat("en-US", {
    style: "decimal",
    ...options,
  }).format(value);
};

export const renderAbatementCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => {
  let formatted = formatCurrency(value, options);
  formatted = formatted.replace(/\.\d+/, "");
  const [, amount] = formatted.match(/^(\D*)(.+)$/)!.slice(1);
  return (
    <>
      <span className={"inline-block align-top text-xs text-muted-foreground"}>
        tCO2e/yr &nbsp;
      </span>
      {amount}
    </>
  );
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

/**
 * Converts a large numeric value into a compact format with an "M" suffix
 * representing millions.
 *
 * @param {number} value - The numeric value to be converted.
 * @returns {string} - The formatted string representing the value in millions with one decimal place.
 *
 * @example
 * toCompactAmount(38023789); // Returns "38.0M"
 */
export const toCompactAmount = (value: number) => {
  return `${(value / 1_000_000).toFixed(1)}M`;
};
