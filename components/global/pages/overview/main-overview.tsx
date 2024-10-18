import { DatePickerWithRange } from "@/components/global/elements/date-range-picker";
import InformationCard from "@/components/global/elements/information-card";
import FinanceChart from "@/components/global/elements/finance-chart";
import LatestTransactions from "@/components/global/elements/latest-transactions";
import { getAllTransactionData } from "@/components/global/utils/transactions";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { useEffect, useState } from "react";
import { HandCoins, Percent, Wallet } from "lucide-react";
import { CategoriesCard } from "@/components/global/elements/categories-card";

export default function MainOverview() {
  const { currentGroup, totalBalance, currentGroupTransactions } =
    useGlobalContext();

  const { getDateRange } = useGlobalContext();
  const [transactionData, setTransactionData] = useState({
    totalIncome: null,
    totalSpend: null,
    totalProfit: null,
  } as {
    totalIncome: number | null;
    totalSpend: number | null;
    totalProfit: number | null;
  });

  useEffect(() => {
    if (currentGroupTransactions) {
      const { totalIncome, totalSpend, totalProfit } = getAllTransactionData(
        currentGroupTransactions,
        getDateRange()
      );
      setTransactionData({
        totalIncome,
        totalSpend,
        totalProfit,
      });
    }
  }, [currentGroupTransactions, getDateRange]);

  return (
    <div className="flex flex-col h-full w-full gap-6 md:gap-10">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <h3 className="text-xl sm:text-3xl font-semibold">
          {currentGroup?.type === "Personal"
            ? "My Overview"
            : `Group: ${currentGroup?.name}`}
        </h3>
        <DatePickerWithRange />
      </div>
      <div className="flex flex-col gap-8 sm:gap-4">
        <div className="w-full grid grid-rows-4 md:grid-rows-none md:grid-cols-4 gap-4">
          <InformationCard title="Current Balance" value={totalBalance} />
          <InformationCard
            title="Total Expenses"
            value={transactionData.totalSpend}
            icon={<HandCoins />}
          />
          <InformationCard
            title="Total income"
            value={transactionData.totalIncome}
            icon={<Wallet />}
          />
          <InformationCard
            title="Total Profit Margin"
            value={transactionData.totalProfit}
            type="percentage"
            icon={<Percent />}
          />
        </div>
        {currentGroupTransactions && <FinanceChart />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-4">
          {currentGroupTransactions && <LatestTransactions />}
          {currentGroupTransactions && <CategoriesCard />}
        </div>
      </div>
    </div>
  );
}
