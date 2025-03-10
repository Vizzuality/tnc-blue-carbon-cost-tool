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
  return (
    <span className={cn("inline-flex flex-wrap gap-x-0.5", className)}>
      <span className={cn({ "text-xs text-muted-foreground": !plainSymbol })}>
        {value < 0 ? "-" : ""}$
      </span>
      <span>
        {formatCurrency(Math.abs(value), options).replace(/^\$\s*/, "")}
      </span>
    </span>
  );
};

export default Currency;
