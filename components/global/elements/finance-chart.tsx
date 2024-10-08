"use client";

import React, { useState } from "react";
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
import { Transaction } from "@/components/global/overview/main-overview";

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

export default function FinanceChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const dailyChartData = getDailyChartData(transactions);
  const [activeView, setActiveView] = useState<"incomeExpenses" | "balance">(
    "incomeExpenses"
  );
  const [activeChartData, setActiveChartData] = useState(dailyChartData);
  const { activeDateOption, getDateRange } = useGlobalContext();
  const [aggregationType, setAggregationType] = useState<
    "day" | "month" | "year"
  >("day");

  const currentConfig = chartConfigs[activeView];

  React.useEffect(() => {
    let { startDate, endDate } = getDateRange();

    startDate.setDate(startDate.getDate() + 1);

    // For 'total' view, use the firstTransactionDate
    if (activeDateOption === "total") {
      startDate = firstTransactionDate(transactions);
      endDate = new Date(); // Set to current date
    }

    // Fill in data for all days in the range
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
        activeView === "balance"
          ? setAggregationType("day")
          : setAggregationType("month");
        break;
      case "year":
        activeView === "balance"
          ? (setAggregationType("day"), (aggregationDays = 3))
          : setAggregationType("month");
        break;
      case "total":
        activeView === "balance"
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
  }, [activeDateOption, getDateRange, activeView, aggregationType]);

  const handleViewChange = (view: string) => {
    setActiveView(view as "incomeExpenses" | "balance");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-2 md:gap-0 md:flex-row justify-between p-6">
        <div className="flex flex-col space-y-1.5">
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>
            {currentConfig.title} for the selected period
          </CardDescription>
        </div>
        <ChartControls
          activeView={activeView}
          onViewChange={handleViewChange}
          views={["incomeExpenses", "balance"]}
          names={["Income and Expenses", "Balance"]}
        />
      </CardHeader>
      <CardContent className="p-1">
        <AnimatePresence mode="wait">
          <motion.div key={activeView}>
            <ChartContainer
              config={currentConfig.config}
              className="h-[200px] aspect-auto"
            >
              {activeView === "balance" ? (
                <BalanceChart
                  data={activeChartData}
                  activeDateOption={activeDateOption}
                />
              ) : (
                <ExpenseChart
                  data={activeChartData}
                  aggregationType={aggregationType}
                  activeDateOption={activeDateOption}
                />
              )}
            </ChartContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
