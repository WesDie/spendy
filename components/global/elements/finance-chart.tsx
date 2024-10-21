"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useGlobalContext } from "@/components/providers/global-context-provider";

import {
  getDailyChartData,
  firstTransactionDate,
  aggregateData,
} from "@/components/global/utils/charts";

import { BalanceChart } from "./charts/balance-chart";
import { ExpenseChart } from "./charts/expenses-chart";
import { ChartControls } from "./charts/chart-controls";

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

export default function FinanceChart() {
  const {
    activeDateOption,
    getDateRange,
    currentGroupTransactions: transactions,
    isTransactionsLoading: isLoading,
    balanceBeforePeriod,
  } = useGlobalContext();

  const [chartType, setChartType] = useState<"balance" | "incomeExpenses">(
    () => {
      if (typeof window !== "undefined") {
        return (
          (localStorage.getItem("chartType") as "balance" | "incomeExpenses") ||
          "incomeExpenses"
        );
      }
      return "incomeExpenses";
    }
  );

  const [displayOption, setDisplayOption] = useState<
    "both" | "income" | "expenses"
  >(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("displayOption") as
          | "both"
          | "income"
          | "expenses") || "both"
      );
    }
    return "both";
  });

  const dailyChartData = getDailyChartData(transactions);
  const [activeChartData, setActiveChartData] = useState(dailyChartData);
  const [aggregationType, setAggregationType] = useState<
    "day" | "month" | "year"
  >("day");

  const currentConfig = chartConfigs[chartType];

  React.useEffect(() => {
    let { startDate, endDate } = getDateRange();

    startDate.setDate(startDate.getDate() + 1);

    if (activeDateOption === "total") {
      startDate = firstTransactionDate(transactions);
      endDate = new Date();
    }

    if (activeDateOption === "total") {
      endDate = new Date(new Date().setDate(new Date().getDate() + 1));
    }

    const filledData: any[] = [];
    const endTime = endDate.getTime();
    const dailyChartMap = new Map(
      dailyChartData.map((item) => [new Date(item.date).toDateString(), item])
    );

    for (
      let d = new Date(startDate);
      d.getTime() <= endTime;
      d.setDate(d.getDate() + 1)
    ) {
      const dateString = d.toDateString();
      const existingData = dailyChartMap.get(dateString);

      if (existingData) {
        filledData.push(existingData);
      } else {
        filledData.push({
          date: d.toISOString(),
          income: 0,
          expenses: 0,
        });
      }
    }

    let aggregationDays = 1;

    switch (activeDateOption) {
      case "month":
        setAggregationType("day");
        break;
      case "halfyear":
        chartType === "balance"
          ? setAggregationType("day")
          : setAggregationType("month");
        break;
      case "year":
        chartType === "balance"
          ? (setAggregationType("day"), (aggregationDays = 3))
          : setAggregationType("month");
        break;
      case "total":
        chartType === "balance"
          ? setAggregationType("month")
          : setAggregationType("year");
        break;
      default:
        setAggregationType("day");
    }

    const aggregatedData = aggregateData(
      filledData,
      aggregationType,
      aggregationDays
    );
    setActiveChartData(aggregatedData as any);
  }, [
    activeDateOption,
    getDateRange,
    chartType,
    aggregationType,
    transactions,
  ]);

  useEffect(() => {
    localStorage.setItem("chartType", chartType);
    localStorage.setItem("displayOption", displayOption);
  }, [chartType, displayOption]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col justify-between gap-2 pb-4 md:gap-0 md:flex-row sm:p-6">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>
            {chartType === "balance" ? "Balance" : "Income and Expenses"} for
            the selected period
          </CardDescription>
        </div>
        <ChartControls
          chartType={chartType}
          onChartTypeChange={setChartType}
          displayOption={displayOption}
          onDisplayOptionChange={setDisplayOption}
        />
      </CardHeader>
      <CardContent className="p-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={chartType}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0.2 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={isLoading ? "animate-pulse" : ""}
          >
            <ChartContainer
              config={currentConfig.config}
              className="h-[200px] aspect-auto"
            >
              {chartType === "balance" ? (
                <BalanceChart
                  data={activeChartData}
                  activeDateOption={activeDateOption}
                  balanceBeforePeriod={balanceBeforePeriod}
                  customTooltip={FinanceChartTooltip}
                />
              ) : (
                <ExpenseChart
                  data={activeChartData}
                  aggregationType={aggregationType}
                  activeDateOption={activeDateOption}
                  customTooltip={FinanceChartTooltip}
                  showIncome={
                    displayOption === "both" || displayOption === "income"
                  }
                  showExpenses={
                    displayOption === "both" || displayOption === "expenses"
                  }
                />
              )}
            </ChartContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function FinanceChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
        <span className="font-medium text-foreground">{label}</span>
        {payload.map((item: any) => (
          <p
            key={item.name}
            className="flex items-center gap-1 text-muted-foreground"
          >
            <span
              className={`w-2 h-2 rounded-[2px]`}
              style={{ backgroundColor: item.stroke }}
            ></span>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}:
            <span className="font-mono font-medium tabular-nums text-foreground">
              ${item.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
}
