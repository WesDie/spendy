"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
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
} from "@/components/ui/chart";

import { useQuery } from "@tanstack/react-query";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { useMemo, useState } from "react";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/database-types";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";
import { firstTransactionDate } from "@/components/global/utils/charts";

export function CategoriesCard() {
  const {
    getDateRange,
    currentGroup,
    activeDateOption,
    currentGroupTransactions: transactions,
    isTransactionsLoading: isLoading,
  } = useGlobalContext();

  const [showPercentage, setShowPercentage] = useState(true);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { data: categories, error: categoriesError } = useQuery({
    queryKey: ["categories", currentGroup?.id],
    queryFn: () =>
      fetch(`/api/categories/get?groupId=${currentGroup?.id}`).then((res) =>
        res.json()
      ),
  });

  const chartData = useMemo(() => {
    if (!categories || !transactions) return [];

    const { startDate, endDate } = getDateRange();

    let firstTransactionDay =
      activeDateOption === "total"
        ? firstTransactionDate(transactions)
        : startDate;

    const monthsInRange =
      (endDate.getFullYear() - firstTransactionDay.getFullYear()) * 12 +
      (endDate.getMonth() - firstTransactionDay.getMonth()) +
      1;

    return categories
      .map((category: Category) => {
        const totalSpent = transactions
          .filter((t) => t.category?.id === category.id)
          .reduce((sum, t) => sum + t.amount, 0);

        const adjustedBudget = category.budget * monthsInRange;
        const percentageSpent = (Math.abs(totalSpent) / adjustedBudget) * 100;

        return {
          icon: category.icon,
          category: category.title,
          spent: Math.abs(totalSpent),
          budget: adjustedBudget,
          percentageSpent: percentageSpent,
          actualPercentage: percentageSpent, // Store actual percentage for tooltip
          fill: category.color,
        };
      })
      .sort((a: any, b: any) =>
        showPercentage
          ? b.actualPercentage - a.actualPercentage
          : b.spent - a.spent
      );
  }, [
    categories,
    transactions,
    getDateRange,
    showPercentage,
    activeDateOption,
  ]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      spent: { label: "Spent" },
    };
    chartData.forEach((item: any) => {
      config[item.category] = {
        label: item.icon + " " + item.category,
        color: item.fill,
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex-col justify-between gap-2 sm:gap-0 sm:flex-row">
        <div className="space-y-1">
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Your spending by category{" "}
            {showPercentage ? "relative to budget" : "in total amount"}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-percentage"
            checked={showPercentage}
            onCheckedChange={setShowPercentage}
          />
          <Label htmlFor="show-percentage">Show percentage</Label>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0.2 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={isLoading ? "animate-pulse" : ""}
        >
          <ChartContainer
            className="h-[300px] aspect-auto mt-auto"
            config={chartConfig}
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={
                isMobile
                  ? { top: 20, right: 0, left: 0, bottom: 5 }
                  : { top: 20, right: 75, left: 70, bottom: 5 }
              }
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="category"
                type="category"
                width={60}
                tickLine={false}
                axisLine={false}
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                domain={[0, 200]}
                tickFormatter={(value) =>
                  `${showPercentage ? value + "%" : "$" + value}`
                }
              />
              <ChartTooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip showPercentage={showPercentage} />}
              />
              {showPercentage && (
                <ReferenceLine
                  x={100}
                  stroke="#666"
                  strokeDasharray="3 3"
                  style={{ strokeWidth: 2 }}
                />
              )}
              <Bar
                dataKey={showPercentage ? "percentageSpent" : "spent"}
                label={<CustomLabel showPercentage={showPercentage} />}
                radius={[0, 4, 4, 0]}
                fillOpacity={0.8}
              />
            </BarChart>
          </ChartContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, showPercentage }: any) => {
  const { getDateRange, activeDateOption } = useGlobalContext();

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const { startDate, endDate } = getDateRange();

    let monthsInRange;
    if (activeDateOption === "total") {
      monthsInRange = "All Time";
    } else {
      monthsInRange =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth()) +
        1;
    }

    return (
      <div className="p-2 space-y-1 border rounded shadow bg-card">
        <p className="flex items-center gap-2">
          <span className={`text-${data.fill}-500`}>{data.icon}</span>
          {data.category}
        </p>
        <div className="flex gap-1">
          <p className="text-foreground/50">
            Budget (
            {activeDateOption === "total"
              ? "All Time"
              : `${monthsInRange} month${monthsInRange !== 1 ? "s" : ""}`}
            )
          </p>
          <p>${data.budget.toFixed(2)}</p>
        </div>
        <div className="flex gap-1">
          <p className="text-foreground/50">Spent</p>
          <p>${data.spent.toFixed(2)}</p>
        </div>
        {showPercentage && (
          <div className="flex gap-1">
            <p className="text-foreground/50">Percentage</p>
            <p>{data.actualPercentage.toFixed(2)}%</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CustomLabel = (props: any) => {
  const { x, y, width, value, showPercentage } = props;
  const displayValue = showPercentage
    ? `${value.toFixed(0)}%`
    : `$${value.toFixed(0)}`;
  return (
    <text
      x={x + width + 5}
      y={y + 15}
      textAnchor="start"
      fill="#666"
      fontSize={12}
      dominantBaseline="middle"
    >
      {displayValue}
    </text>
  );
};
