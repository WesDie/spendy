import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getTimeFormat } from "@/components/global/utils/charts";

interface ExpenseChartProps {
  data: any[];
  activeDateOption: string;
  aggregationType: string;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({
  data,
  activeDateOption,
  aggregationType,
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      accessibilityLayer
      data={data}
      margin={{
        left: 0,
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
        tickFormatter={(value) => {
          const formattedDate = format(
            new Date(value),
            getTimeFormat(activeDateOption)
          );
          return aggregationType === "month"
            ? formattedDate.replace("01 ", " ")
            : formattedDate;
        }}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) => `$${value}`}
      />
      <ChartTooltip
        cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
        content={<ChartTooltipContent indicator="dot" />}
      />
      <Bar dataKey="expenses" fill="var(--color-expenses)" stackId="a" />
      <Bar dataKey="income" fill="var(--color-income)" stackId="a" />
    </BarChart>
  </ResponsiveContainer>
);
