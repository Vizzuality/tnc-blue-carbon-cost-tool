"use client";

import { FC } from "react";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/format";

import { chartData } from "@/containers/projects/custom-project/annual-project-cash-flow/table/columns";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const CHART_COLORS = {
  estimatedRevenue: "hsl(var(--chart-1))",
  totalOpEx: "hsl(var(--chart-2))",
  annualNetCashFlow: "hsl(var(--chart-3))",
  revenueOpEx: "hsl(var(--chart-4))",
} as const;

const CashflowChart: FC = () => {
  return (
    <ChartContainer
      config={{
        estimatedRevenue: {
          label: "Est revenue",
          color: "hsl(var(--chart-1))",
        },
        totalOpEx: {
          label: "Total OpEx",
          color: "hsl(var(--chart-2))",
        },
        annualNetCashFlow: {
          label: "Annual net cash flow",
          color: "hsl(var(--chart-3))",
          icon: () => <div className="h-[3px] w-[24px] bg-chart-3" />,
        },
        revenueOpEx: {
          label: "Revenue OpEx",
          color: "hsl(var(--chart-4))",
          icon: () => <div className="h-[3px] w-[24px] bg-chart-4" />,
        },
      }}
      className="cashflow-chart min-h-[200px] w-full"
    >
      <ComposedChart data={chartData} stackOffset="sign" accessibilityLayer>
        <CartesianGrid
          stroke="#194760"
          strokeDasharray="0 0"
          horizontal={true}
          vertical={true}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />

        <ChartLegend
          content={
            <ChartLegendContent className="bg-big-stone-950/60 py-2 backdrop-blur-[2px]" />
          }
        />
        <Bar
          stackId="a"
          dataKey="estimatedRevenue"
          fill={CHART_COLORS.estimatedRevenue}
          radius={[6, 6, 0, 0]}
        />
        <Bar
          stackId="a"
          dataKey="totalOpEx"
          fill={CHART_COLORS.totalOpEx}
          radius={[6, 6, 0, 0]}
        />
        <Line
          type="linear"
          dataKey="annualNetCashFlow"
          stroke={CHART_COLORS.annualNetCashFlow}
          dot={false}
          strokeWidth={2}
        />
        <Line
          type="linear"
          dataKey="revenueOpEx"
          stroke={CHART_COLORS.revenueOpEx}
          dot={false}
          strokeWidth={2}
        />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={false}
          className="-translate-y-[100%]"
          tick={(props) => {
            const { x, y, payload } = props;

            // Not sure if needed, and from which number to count?
            if (payload.value < 0) return <g></g>;

            return (
              <g transform={`translate(${x + 10},${y + 60})`}>
                <foreignObject
                  x="0"
                  y="4"
                  width="1"
                  height="1"
                  style={{
                    overflow: "visible",
                  }}
                >
                  <p className="inline-flex items-center justify-center gap-0.5 rounded-sm bg-big-stone-950/60 px-2 py-1 text-white backdrop-blur-[2px]">
                    <span>{payload.value}</span>
                  </p>
                </foreignObject>
              </g>
            );
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              className="border-border"
              formatter={(v, n) => {
                return (
                  <p className="inline-flex w-full justify-between gap-2">
                    <span className="text-muted-foreground">{n}</span>
                    <span className="font-normal">
                      {formatCurrency(v as number, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </p>
                );
              }}
              hideIndicator
              hideIcon
              hideLabel
            />
          }
        />
      </ComposedChart>
    </ChartContainer>
  );
};

export default CashflowChart;
