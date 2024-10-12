import { DatePickerWithRange } from "../elements/date-range-picker";
import InformationCard from "../elements/information-card";
import FinanceChart from "../elements/finance-chart";
import LatestTransactions from "../elements/latest-transactions";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactionData } from "../utils/transactions";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { useEffect, useState } from "react";
import { Percent } from "lucide-react";
import OverviewSkeleton from "./overview-skeleton";
import { CategoriesCard } from "../elements/categories-card";

export default function MainOverview() {
  const { data: transactions, error: transactionsError } = useQuery({
    queryKey: ["transactions", 17],
    queryFn: () =>
      fetch(`/api/transactions/getAll?groupId=17`).then((res) => res.json()),
  });

  const { getDateRange } = useGlobalContext();
  const [transactionData, setTransactionData] = useState({
    totalBalance: null,
    totalIncome: null,
    totalSpend: null,
    totalProfit: null,
  } as {
    totalBalance: number | null;
    totalIncome: number | null;
    totalSpend: number | null;
    totalProfit: number | null;
  });

  useEffect(() => {
    if (transactions) {
      const { totalBalance, totalIncome, totalSpend, totalProfit } =
        getAllTransactionData(transactions, getDateRange());
      setTransactionData({
        totalBalance,
        totalIncome,
        totalSpend,
        totalProfit,
      });
    }
  }, [transactions, getDateRange]);

  if (!transactions) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="flex flex-col h-full w-full gap-6 md:gap-10">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <h3 className="text-3xl font-semibold">Overview</h3>
        <DatePickerWithRange />
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full grid grid-rows-4 md:grid-rows-none md:grid-cols-4 gap-4">
          <InformationCard
            title="Current Balance"
            value={transactionData.totalBalance}
          />
          <InformationCard
            title="Total Expenses"
            value={transactionData.totalSpend}
          />
          <InformationCard
            title="Total income"
            value={transactionData.totalIncome}
          />
          <InformationCard
            title="Total Profit Margin"
            value={transactionData.totalProfit}
            type="percentage"
            icon={<Percent />}
          />
        </div>
        {transactions && <FinanceChart transactions={transactions} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions && <LatestTransactions transactions={transactions} />}
          {transactions && <CategoriesCard transactions={transactions} />}
        </div>
      </div>
    </div>
  );
}
