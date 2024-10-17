import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ChartTooltip } from "@/components/ui/chart";
import { getTimeFormat } from "@/components/global/utils/charts";

interface BalanceChartProps {
  data: any[];
  activeDateOption: string;
  customTooltip?: (props: TooltipProps<number, string>) => React.ReactNode;
}

export const BalanceChart: React.FC<BalanceChartProps> = ({
  data,
  activeDateOption,
  customTooltip,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 0,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-balance)"
              stopOpacity={0.35}
            />
            <stop
              offset="95%"
              stopColor="var(--color-balance)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
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
        <ChartTooltip cursor={false} content={customTooltip} />
        <Area
          dataKey="balance"
          type="monotone"
          fill="url(#balanceGradient)"
          fillOpacity={1}
          stroke="var(--color-balance)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
