import { FC } from "react";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CurrencyProps {
  /** The numeric value to format as currency */
  value: number;
  /**
   * Intl.NumberFormat options to customize the currency formatting
   * @default { style: "currency", currency: "USD" }
   * Override these defaults by passing your own options:
   * - currency: Change currency code (e.g. "EUR", "GBP")
   * - minimumFractionDigits: Min decimal places
   * - maximumFractionDigits: Max decimal places
   * - notation: "standard" | "compact" for abbreviated large numbers
   */
  options?: Intl.NumberFormatOptions;
  /** Optional CSS classes to apply to the wrapper span */
  className?: HTMLSpanElement["className"];
  /**
   * Controls the styling of the currency symbol
   * @default false - Currency symbol will be smaller, aligned top with muted color
   * When true - Currency symbol will have the same styling as the number
   */
  plainSymbol?: boolean;
}

const Currency: FC<CurrencyProps> = ({
  value,
  options = {},
  className,
  plainSymbol,
}) => {
  const absValue = Math.abs(value);
  const formatOptions = { ...options };

  if (absValue >= 1e12) {
    formatOptions.notation = "compact";
    formatOptions.maximumFractionDigits = 2;
  }

  return (
    <span className={cn("inline-flex gap-x-0.5", className)}>
      <span className={cn({ "text-xs text-muted-foreground": !plainSymbol })}>
        {value < 0 ? "-" : ""}$
      </span>
      <span className="overflow-hidden text-ellipsis">
        {formatCurrency(absValue, formatOptions).replace(/^\$\s*/, "")}
      </span>
    </span>
  );
};

export default Currency;
