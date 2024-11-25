import { FC } from "react";

import { renderCurrency } from "@/lib/format";

interface GraphProps {
  total: number;
  segments: GraphSegment[];
  leftover?: number;
}

interface GraphSegment {
  value: number;
  colorClass: string;
}

const getSize = (value: number, total: number) => {
  const percentage = (value / total) * 100;
  return `${Math.max(percentage, 0)}%`;
};

const Graph: FC<GraphProps> = ({ total, leftover, segments }) => {
  if (leftover) {
    return (
      <div className="relative h-full min-h-[150px] w-full max-w-[400px] overflow-hidden rounded-md">
        <div className="absolute flex h-full w-full flex-row gap-1 rounded-md">
          <div
            style={{
              height: "100%",
              width: "100%",
            }}
            className="relative h-full rounded-md bg-yellow-500 transition-all duration-300 ease-in-out"
          >
            <div className="absolute bottom-1 left-0 right-0 mx-1">
              <div className="rounded-md bg-white/30 px-1.5 py-0.5 text-center text-xs font-semibold text-secondary-foreground">
                {renderCurrency(
                  total,
                  {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  },
                  "first-letter:text-secondary-foreground",
                )}
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-1 rounded-md">
            {segments.map(({ value, colorClass }) => (
              <div
                key={`graph-segment-${colorClass}-${value}`}
                style={{
                  height: getSize(value, total),
                  width: "100%",
                }}
                className={`relative h-full rounded-md transition-all duration-300 ease-in-out ${colorClass}`}
              >
                <div className="absolute bottom-1 left-0 right-0 mx-1">
                  <div className="rounded-md bg-white/30 px-1.5 py-0.5 text-center text-xs font-semibold text-secondary-foreground">
                    {renderCurrency(
                      value,
                      {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      },
                      "first-letter:text-secondary-foreground",
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                height: getSize(leftover, total),
                width: "100%",
              }}
              className={`relative h-full rounded-md border border-dashed border-white`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-40 max-w-[200px] flex-1 overflow-hidden">
      <div className="flex h-full flex-col gap-1">
        {segments.map(({ value, colorClass }) => (
          <div
            key={`graph-segment-${colorClass}-${value}`}
            style={{
              height: getSize(value, total),
            }}
            className={`relative min-h-[30px] rounded-md px-6 transition-all duration-300 ease-in-out ${colorClass}`}
          >
            <div className="absolute bottom-1 left-0 right-0 mx-1">
              <div className="rounded-sm bg-white/50 px-1.5 py-0.5 text-center text-xs font-semibold text-big-stone-950">
                {renderCurrency(
                  value,
                  {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  },
                  "first-letter:text-secondary-foreground",
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface GraphLegendItem {
  label: string;
  textColor: string;
  bgColor: string;
}

interface GraphLegendProps {
  items: GraphLegendItem[];
}

const GraphLegend: FC<GraphLegendProps> = ({ items }) => {
  return (
    <div className="mt-4 space-y-2">
      {items.map(({ label, textColor, bgColor }) => (
        <div
          key={`legend-item-${label}-${textColor}`}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${bgColor}`}></div>
            <span className={`text-xs ${textColor}`}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export { Graph, GraphLegend };
