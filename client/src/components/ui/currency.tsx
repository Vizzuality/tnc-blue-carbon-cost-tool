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
    <span
      className={cn(
        {
          "inline-block": true,
          "first-letter:align-top first-letter:text-xs first-letter:tracking-[0.1rem] first-letter:text-muted-foreground":
            !plainSymbol,
          "first-letter:pr-1": plainSymbol,
        },
        className,
      )}
    >
      {formatCurrency(value, options)}
    </span>
  );
};

export default Currency;
