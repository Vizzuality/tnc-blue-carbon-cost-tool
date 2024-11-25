import { FC } from "react";

import { renderCurrency } from "@/lib/format";

interface GraphProps {
  summary?: {
    totalCost: number;
    capEx: GraphSegment;
    opEx: GraphSegment;
  };
  leftOver?: {
    leftover: number;
    totalRevenue: GraphSegment;
    opEx: GraphSegment;
  };
}

interface GraphSegment {
  value: number;
  colorClass: string;
}

const getSize = (value: number, total: number) => {
  const percentage = (value / total) * 100;
  return `${Math.max(percentage, 0)}%`;
};

const Graph: FC<GraphProps> = ({ leftOver, summary }) => {
  if (leftOver) {
    return (
      <div className="relative h-full min-h-[150px] w-full max-w-[400px] overflow-hidden rounded-md">
        <div className="absolute flex h-full w-full flex-row gap-1 rounded-md">
          <div
            style={{
              height: "100%",
              width: "100%",
            }}
            className={`relative h-full rounded-md transition-all duration-300 ease-in-out ${leftOver.totalRevenue.colorClass}`}
          >
            <div className="absolute bottom-1 left-0 right-0 mx-1">
              <div className="rounded-md bg-white/30 px-1.5 py-0.5 text-center text-xs font-semibold text-secondary-foreground">
                {renderCurrency(
                  leftOver.totalRevenue.value,
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
            <div
              style={{
                height: getSize(
                  leftOver.opEx.value,
                  leftOver.totalRevenue.value,
                ),
                width: "100%",
              }}
              className={`relative h-full rounded-md transition-all duration-300 ease-in-out ${leftOver.opEx.colorClass}`}
            >
              <div className="absolute bottom-1 left-0 right-0 mx-1">
                <div className="rounded-md bg-white/30 px-1.5 py-0.5 text-center text-xs font-semibold text-secondary-foreground">
                  {renderCurrency(
                    leftOver.opEx.value,
                    {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    },
                    "first-letter:text-secondary-foreground",
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                height: getSize(leftOver.leftover, leftOver.totalRevenue.value),
                width: "100%",
              }}
              className={`relative h-full rounded-md border border-dashed border-white`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (summary) {
    return (
      <div className="relative h-40 max-w-[200px] flex-1 overflow-hidden">
        <div className="flex h-full flex-col gap-1">
          <div
            style={{
              height: getSize(summary.capEx.value, summary.totalCost),
            }}
            className={`relative min-h-[30px] rounded-md px-6 transition-all duration-300 ease-in-out ${summary.capEx.colorClass}`}
          >
            <div className="absolute bottom-1 left-0 right-0 mx-1">
              <div className="rounded-sm bg-white/50 px-1.5 py-0.5 text-center text-xs font-semibold text-big-stone-950">
                {renderCurrency(
                  summary.capEx.value,
                  {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  },
                  "first-letter:text-secondary-foreground",
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              height: getSize(summary.opEx.value, summary.totalCost),
            }}
            className={`relative min-h-[30px] rounded-md px-6 transition-all duration-300 ease-in-out ${summary.opEx.colorClass}`}
          >
            <div className="absolute bottom-1 left-0 right-0 mx-1">
              <div className="rounded-sm bg-white/50 px-1.5 py-0.5 text-center text-xs font-semibold text-big-stone-950">
                {renderCurrency(
                  summary.opEx.value,
                  {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  },
                  "first-letter:text-secondary-foreground",
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
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
