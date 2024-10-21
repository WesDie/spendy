import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";
import { format } from "date-fns";
import { ChartTooltip } from "@/components/ui/chart";
import { getTimeFormat } from "@/components/global/utils/charts";

interface ExpenseChartProps {
  data: any[];
  activeDateOption: string;
  aggregationType: string;
  customTooltip?: (props: TooltipProps<number, string>) => React.ReactNode;
  showIncome: boolean;
  showExpenses: boolean;
}

export const ExpenseChart: React.FC<ExpenseChartProps> = ({
  data,
  activeDateOption,
  aggregationType,
  customTooltip,
  showIncome,
  showExpenses,
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
      <defs>
        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
          <stop
            offset="95%"
            stopColor="hsl(var(--chart-1))"
            stopOpacity={0.2}
          />
        </linearGradient>
        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
          <stop
            offset="95%"
            stopColor="hsl(var(--chart-2))"
            stopOpacity={0.2}
          />
        </linearGradient>
      </defs>
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
        content={customTooltip}
      />
      {showExpenses && (
        <Bar
          dataKey="expenses"
          fill="url(#expenseGradient)"
          stroke="var(--color-expenses)"
          strokeOpacity={0}
        />
      )}
      {showIncome && (
        <Bar
          dataKey="income"
          fill="url(#incomeGradient)"
          stroke="var(--color-income)"
          strokeOpacity={0}
        />
      )}
    </BarChart>
  </ResponsiveContainer>
);
