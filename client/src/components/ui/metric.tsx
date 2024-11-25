import { FC, useMemo } from "react";

import { cn } from "@/lib/utils";

import Currency from "@/components/ui/currency";

interface MetricProps {
  /** The numeric value to display
   * undefined -> renders "-"
   */
  value?: number;
  /** Unit to display (e.g. "kg", "%", "m²") */
  unit: string;
  /** Optional CSS classes to apply to the wrapper */
  className?: string;
  /**
   * Controls unit position relative to the value
   * @default false - Unit appears after the value
   * When true - Unit appears before the value
   */
  unitBeforeValue?: boolean;
  /**
   * Render as currency using the Currency component
   * @default false - Renders as regular number with unit
   * When true - Uses Currency component formatting
   */
  isCurrency?: boolean;
  /**
   * Number format options when not rendering as currency
   * @default {}
   */
  numberFormatOptions?: Intl.NumberFormatOptions;
  /**
   * Apply alternative styling to the unit
   * @default false - Unit has regular text styling
   * When true - Unit has smaller size and muted color
   */
  compactUnit?: boolean;
}

const Metric: FC<MetricProps> = ({
  value,
  unit,
  className,
  unitBeforeValue = false,
  isCurrency = false,
  numberFormatOptions = {},
  compactUnit = false,
}) => {
  const ValueElement = useMemo(() => {
    if (!value) return null;

    return (
      <span>
        {new Intl.NumberFormat("en-US", numberFormatOptions).format(value)}
      </span>
    );
  }, [numberFormatOptions, value]);
  const UnitElement = useMemo(
    () => (
      <span className={cn({ "text-xs text-muted-foreground": compactUnit })}>
        {unit}
      </span>
    ),
    [compactUnit, unit],
  );

  if (!value) return <span className="text-base font-medium">-</span>;

  if (isCurrency) {
    return (
      <Currency
        value={value}
        className={className}
        options={numberFormatOptions}
      />
    );
  }

  return (
    <span className={cn("space-x-1 text-base font-medium", className)}>
      {unitBeforeValue ? (
        <>
          {UnitElement}
          {ValueElement}
        </>
      ) : (
        <>
          {ValueElement}
          {UnitElement}
        </>
      )}
    </span>
  );
};

export default Metric;
