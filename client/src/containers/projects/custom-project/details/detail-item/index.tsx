import { FC } from "react";

import ReactCountryFlag from "react-country-flag";

interface SubValue {
  label: string;
  value: string | number;
  unit: string;
}

interface DetailItemProps {
  label: string;
  value?: string | number;
  unit?: string;
  countryCode?: string;
  prefix?: string;
  subValues?: SubValue[];
}

const formatValue = (value: string | number) => {
  if (typeof value === "string") return value;

  return Math.round((value + Number.EPSILON) * 100) / 100;
};

const DetailItem: FC<DetailItemProps> = ({
  label,
  value,
  unit,
  countryCode,
  prefix,
  subValues,
}) => {
  return (
    <div>
      <h3 className="text-sm font-normal text-muted-foreground">{label}</h3>
      <div className="flex items-center gap-2">
        {countryCode && (
          <ReactCountryFlag
            className="h-[16px] w-[22px] rounded"
            countryCode={countryCode}
            svg
          />
        )}
        <p className="space-x-1 font-normal">
          {prefix && (
            <span className="align-super text-xs text-muted-foreground">
              {prefix}
            </span>
          )}
          {value && <span className="text-xl">{formatValue(value)}</span>}
          {unit && (
            <span className="text-xs text-muted-foreground">{unit}</span>
          )}
        </p>
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
