import { FC } from "react";

import ReactCountryFlag from "react-country-flag";

import getCountryISO2 from "country-iso-3-to-2";

import Metric from "@/components/ui/metric";
import { cn } from "@/lib/utils";

interface SubValue {
  label: string;
  value: string | number;
  unit: string;
}

interface DetailItemProps {
  label: string;
  value?: string | number | null;
  unit?: string;
  countryCode?: string;
  subValues?: SubValue[];
  numberFormatOptions?: Intl.NumberFormatOptions;
}

const formatValue = (value?: string | number) => {
  if (!value) return null;
  if (typeof value === "string") return value;

  return Math.round((value + Number.EPSILON) * 100) / 100;
};

const DetailItem: FC<DetailItemProps> = ({
  label,
  value,
  unit,
  countryCode,
  subValues,
  numberFormatOptions = {},
}) => {
  const isMetric = unit && typeof value === "number";

  return (
    <div>
      <h3 className="text-sm font-normal text-muted-foreground">{label}</h3>
      <div className="flex items-center gap-2">
        {countryCode && (
          <ReactCountryFlag
            className="h-[16px] w-[22px] rounded"
            countryCode={getCountryISO2(countryCode)}
            svg
          />
        )}
        {isMetric ? (
          <Metric
            value={value}
            unit={unit}
            isCurrency={unit === "$"}
            numberFormatOptions={numberFormatOptions}
            compactUnit
          />
        ) : value !== undefined && value !== null ? (
          <span className="2xl:text-xl">
            {formatValue(value)}{" "}
            {unit && (
              <span className={cn({ "text-xs text-muted-foreground": unit })}>
                {unit}
              </span>
            )}
          </span>
      </div>
      {subValues?.map((subValue, index) => (
        <p key={index} className="space-x-1 font-normal">
          <span className="text-xs text-muted-foreground">
            {subValue.label}
          </span>
          <span className="text-xl">{formatValue(subValue.value)}</span>
          <span className="text-xs text-muted-foreground">{subValue.unit}</span>
        </p>
      ))}
    </div>
  );
};

export default DetailItem;
