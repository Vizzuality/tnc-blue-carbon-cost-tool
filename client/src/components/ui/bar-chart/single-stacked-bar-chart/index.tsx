import { FC } from "react";

import { cn } from "@/lib/utils";

interface SingleStackedBarChartProps {
  total: Segment;
  segments: Segment[];
}
interface Segment {
  id: string;
  value: number;
  colorClass: string;
}

const getSize = (value: number, total: number) => {
  const percentage = (value / total) * 100;
  return `${Math.max(percentage, 0)}%`;
};

const SingleStackedBarChart: FC<SingleStackedBarChartProps> = ({
  total,
  segments,
}) => {
  return (
    <div className={cn("flex h-2 w-full", total.colorClass)}>
      {segments.map((s) => (
        <div
          key={s.id}
          className={s.colorClass}
          style={{
            width: getSize(s.value, total.value),
          }}
        ></div>
      ))}
    </div>
  );
};

export default SingleStackedBarChart;
