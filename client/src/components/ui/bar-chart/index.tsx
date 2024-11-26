import { toCompactAmount } from "@/lib/format";

interface BarChartProps {
  total: number;
  segments: {
    value: number;
    label: string;
    colorClass: string;
  }[];
  orientation?: "horizontal" | "vertical";
}

const BarChart = ({
  total,
  segments,
  orientation = "horizontal",
}: BarChartProps) => {
  const getSize = (value: number) => {
    const percentage = (value / total) * 100;
    return `${Math.max(percentage, 0)}%`;
  };

  if (orientation === "horizontal") {
    return (
      <div className="relative h-full min-h-[150px] w-full overflow-hidden rounded-lg">
        <div className="absolute flex h-full w-full flex-row gap-1">
          {segments.map((segment, index) => (
            <div
              key={index}
              style={{
                height: getSize(segment.value),
                width: "100%",
              }}
              className={`relative h-full rounded transition-all duration-300 ease-in-out ${segment.colorClass}`}
            >
              <div className="absolute bottom-1 left-0 right-0 mx-1">
                <div className="rounded bg-white/50 px-1.5 py-0.5 text-center text-xs font-semibold text-big-stone-950">
                  ${toCompactAmount(segment.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg">
      <div className="absolute flex h-full w-full flex-col gap-1">
        {segments.map((segment, index) => (
          <div
            key={index}
            style={{
              height: getSize(segment.value),
            }}
            className={`relative min-h-[30px] w-full transition-all duration-300 ease-in-out ${segment.colorClass}`}
          >
            <div className="absolute bottom-1 left-0 right-0 mx-1">
              <div className="rounded bg-white/50 px-1.5 py-0.5 text-center text-xs font-semibold text-big-stone-950">
                ${toCompactAmount(segment.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
