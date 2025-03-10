import { FC, useMemo } from "react";

import { cn } from "@/lib/utils";

import Currency from "@/components/ui/currency";

interface GraphProps {
  /** The total value that represents 100% of the graph */
  total: number;
  /** Array of segments to be visualized in the graph, each with a value and color */
  segments: GraphSegment[];
  /** Optional value that, when provided, shows a split view with total on left and segments with leftover on right */
  leftover?: number;
}

interface GraphSegment {
  /** Numerical value of the segment */
  value: number;
  /** Tailwind CSS color class to be applied to the segment */
  colorClass: string;
}

const getPercentage = (value: number, total: number) => (value / total) * 100;
const getSize = (value: number, total: number) => {
  const percentage = getPercentage(value, total);
  return `${Math.max(percentage, 0)}%`;
};

interface LeftOverGraphProps {
  leftover: number;
  leftoverHeight: string;
  minHeight?: string;
}

const LeftOverGraph: FC<LeftOverGraphProps> = ({
  leftover,
  leftoverHeight,
  minHeight,
}) => {
  return (
    <div
      style={{
        height: leftoverHeight,
        width: "100%",
        minHeight: minHeight,
      }}
      className={`relative flex h-full flex-col items-center justify-end rounded-md border border-dashed border-white p-1`}
    >
      <span className="rounded-sm bg-white/30 px-5 py-1 text-xs font-semibold text-card-foreground">
        {
          <Currency
            value={leftover}
            options={{
              notation: "compact",
              maximumFractionDigits: 1,
            }}
            plainSymbol
          />
        }
      </span>
    </div>
  );
};

/**
 * A responsive graph component that visualizes numerical data as vertical segments
 * Has two display modes:
 * 1. Standard mode: Shows segments stacked vertically
 * 2. Split mode (when leftover is provided): Shows total on left and segments with leftover on right
 */
const Graph: FC<GraphProps> = ({ total, leftover, segments }) => {
  if (typeof leftover === "number") {
    // Calculate heights for split mode visualization
    const {
      totalRevenueHeight,
      leftoverHeight,
      leftoverMinHeight,
      totalRevenueMinHeight,
    } = calculateSplitModeHeights(total, leftover);

    return (
      <div className="relative h-full min-h-[150px] w-full max-w-[400px] overflow-hidden rounded-md">
        <div className="absolute flex h-full w-full flex-row gap-1 rounded-md">
          <div className="flex h-full w-full flex-col gap-1">
            {leftover < 0 && (
              <LeftOverGraph
                leftover={leftover}
                leftoverHeight={leftoverHeight}
                minHeight={leftoverMinHeight}
              />
            )}
            <div
              style={{
                height: totalRevenueHeight,
                width: "100%",
                minHeight: totalRevenueMinHeight,
              }}
              className="relative h-full rounded-md bg-yellow-500 transition-all duration-300 ease-in-out"
            >
              <div className="absolute bottom-1 left-0 right-0 mx-1">
                <div className="rounded-md bg-white/30 px-1.5 py-0.5 text-center text-xs font-semibold text-secondary-foreground">
                  <Currency
                    value={total}
                    options={{
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }}
                    plainSymbol
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col gap-1 rounded-md">
            {leftover > 0 && (
              <LeftOverGraph
                leftover={leftover}
                leftoverHeight={leftoverHeight}
                minHeight={leftoverMinHeight}
              />
            )}
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
                    <Currency
                      value={value}
                      options={{
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }}
                      plainSymbol
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-40 max-w-[200px] flex-1 overflow-hidden rounded-md border border-dashed border-white p-1">
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
                <Currency
                  value={value}
                  options={{
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }}
                  plainSymbol
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Calculates the heights for the split mode visualization
 * @param total - The total value
 * @param leftover - The leftover value (can be positive or negative)
 * @returns Object containing calculated heights and minimum heights for visualization
 */
function calculateSplitModeHeights(total: number, leftover: number) {
  // Default height for total revenue (used when leftover is positive)
  let totalRevenueHeight = "100%";

  // Calculate absolute values for consistent calculations
  const absLeftover = Math.abs(leftover);
  const absTotal = total + absLeftover;

  // Initial leftover height calculation (used when leftover is positive)
  let leftoverHeight = getSize(leftover, total);

  // Calculate leftover as percentage of the combined total
  const leftoverPercentage = getPercentage(absLeftover, absTotal);

  // Determine if we need to enforce minimum heights for better visualization
  // (when one segment would be too small or too large)
  const fixedHeights = leftoverPercentage < 20 || leftoverPercentage > 80;

  // Set minimum heights to ensure visibility of small segments
  const leftoverMinHeight =
    fixedHeights && leftoverPercentage < 20 ? "21%" : undefined;
  const totalRevenueMinHeight =
    fixedHeights && leftoverPercentage > 80 ? "21%" : undefined;

  // For negative leftover, recalculate heights based on absolute values
  if (leftover < 0) {
    totalRevenueHeight = getSize(total, absTotal);
    leftoverHeight = getSize(absLeftover, absTotal);
  }

  return {
    totalRevenueHeight,
    leftoverHeight,
    leftoverMinHeight,
    totalRevenueMinHeight,
  };
}

interface GraphLegendItem {
  label: string;
  circleClassName: string;
  labelClassName: string;
}

interface GraphLegendProps {
  items: GraphLegendItem[];
}

const GraphLegend: FC<GraphLegendProps> = ({ items }) => {
  return (
    <div className="mt-4 space-y-2">
      {items.map(({ label, circleClassName, labelClassName }) => (
        <div
          key={`legend-item-${label}-${circleClassName}`}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full", circleClassName)}></div>
            <span className={cn("text-xs", labelClassName)}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

interface GraphWithLegendProps {
  /** The total value to be displayed */
  total: number;
  /** Optional value that, when provided, shows a split view with total on left and segments with leftover on right */
  leftover?: number;
  /** Array of segments with their corresponding legend items */
  items: Array<{
    value: number;
    label: string;
    circleClassName: string;
    labelClassName: string;
  }>;
}

const GraphWithLegend: FC<GraphWithLegendProps> = ({
  total,
  leftover,
  items,
}) => {
  const graphLegendItems = useMemo(() => {
    return [
      ...(leftover
        ? [
            {
              label: "Leftover",
              circleClassName: "border border-dashed border-white",
              labelClassName: "text-white",
            },
            {
              label: "Total Revenue",
              circleClassName: "bg-yellow-500",
              labelClassName: "text-yellow-500",
            },
          ]
        : [
            {
              label: "Total",
              circleClassName: "border border-dashed border-white",
              labelClassName: "text-white",
            },
          ]),
      ...items.map(({ label, circleClassName, labelClassName }) => ({
        label,
        circleClassName,
        labelClassName,
      })),
    ];
  }, [leftover, items]);

  return (
    <div className="flex min-h-[160px] justify-between gap-4">
      <div className="flex max-w-[148px] flex-1 flex-col justify-between">
        <div>
          <span className="text-xl font-normal">
            <Currency value={leftover || total} />
          </span>
        </div>
        <GraphLegend items={graphLegendItems} />
      </div>
      <Graph
        total={total}
        segments={items.map(({ value, circleClassName }) => ({
          value,
          colorClass: circleClassName,
        }))}
        leftover={leftover}
      />
    </div>
  );
};

export { Graph, GraphLegend, GraphWithLegend };
