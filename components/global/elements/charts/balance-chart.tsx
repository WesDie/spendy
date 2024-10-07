import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getTimeFormat } from "@/components/global/utils/charts";

interface BalanceChartProps {
  data: any[];
  activeDateOption: string;
}

export const BalanceChart: React.FC<BalanceChartProps> = ({
  data,
  activeDateOption,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) =>
            format(new Date(value), getTimeFormat(activeDateOption))
          }
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="balance"
          type="monotone"
          fill="var(--color-balance)"
          fillOpacity={0.4}
          stroke="var(--color-balance)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
