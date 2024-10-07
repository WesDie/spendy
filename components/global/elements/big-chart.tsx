"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Jan", income: 1200, expenses: 900, balance: 300 },
  { month: "Feb", income: 1200, expenses: 1100, balance: 100 },
  { month: "Mar", income: 1200, expenses: 1050, balance: 150 },
  { month: "Apr", income: 1200, expenses: 1000, balance: 200 },
  { month: "May", income: 1200, expenses: 200, balance: 1000 },
  { month: "Jun", income: 1200, expenses: 300, balance: 900 },
  { month: "Jul", income: 1200, expenses: 1020, balance: 180 },
  { month: "Aug", income: 1200, expenses: 1120, balance: 80 },
  { month: "Sep", income: 1200, expenses: 1010, balance: 190 },
  { month: "Oct", income: 1200, expenses: 1090, balance: 110 },
  { month: "Nov", income: 1200, expenses: 1030, balance: 170 },
  { month: "Dec", income: 1200, expenses: 1110, balance: 90 },
];

const chartConfigs = {
  incomeExpenses: {
    config: {
      income: {
        label: "Income",
        color: "hsl(var(--chart-1))",
      },
      expenses: {
        label: "Expenses",
        color: "hsl(var(--chart-2))",
      },
    },
    title: "Income and Expenses",
  },
  balance: {
    config: {
      balance: {
        label: "Balance",
        color: "hsl(var(--chart-3))",
      },
    },
    title: "Balance",
  },
};

export default function BigChart() {
  const [activeView, setActiveView] = useState<"incomeExpenses" | "balance">(
    "incomeExpenses"
  );

  const currentConfig = chartConfigs[activeView];

  const handleViewChange = (view: "incomeExpenses" | "balance") => {
    setActiveView(view);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-6">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>
            {currentConfig.title} for the last 12 months
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <Button
            onClick={() => handleViewChange("incomeExpenses")}
            variant={activeView === "incomeExpenses" ? "default" : "outline"}
          >
            Income/Expenses
          </Button>
          <Button
            onClick={() => handleViewChange("balance")}
            variant={activeView === "balance" ? "default" : "outline"}
          >
            Balance
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ChartContainer
              config={currentConfig.config}
              className="h-[200px] aspect-auto"
            >
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
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
                {activeView === "balance" ? (
                  <Area
                    dataKey="balance"
                    type="monotone"
                    fill="var(--color-balance)"
                    fillOpacity={0.4}
                    stroke="var(--color-balance)"
                  />
                ) : (
                  <>
                    <Area
                      dataKey="expenses"
                      type="monotone"
                      fill="var(--color-expenses)"
                      fillOpacity={0.4}
                      stroke="var(--color-expenses)"
                      stackId="a"
                    />
                    <Area
                      dataKey="income"
                      type="monotone"
                      fill="var(--color-income)"
                      fillOpacity={0.4}
                      stroke="var(--color-income)"
                      stackId="a"
                    />
                  </>
                )}
              </AreaChart>
            </ChartContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
