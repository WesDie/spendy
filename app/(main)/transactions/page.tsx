"use client";
import TransactionTable from "@/components/global/elements/transaction-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function Transactions() {
  const { data: transactions, error: transactionsError } = useQuery({
    queryKey: ["transactions", 17],
    queryFn: () =>
      fetch(`/api/transactions/getAll?groupId=17`).then((res) => res.json()),
  });

  if (!transactions) {
    return (
      <main className="flex flex-col h-full w-full p-6 px-4 md:p-8">
        <div className="flex flex-col h-full w-full gap-6 md:gap-10">
          <h3 className="text-xl sm:text-3xl font-semibold">Transactions</h3>
          <div className="flex flex-col gap-4 w-full">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-full w-full p-6 px-4 md:p-8">
      <div className="flex flex-col h-full w-full gap-6 md:gap-10">
        <h3 className="text-xl sm:text-3xl font-semibold">Transactions</h3>
        <div className="flex flex-col gap-4">
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </main>
  );
}
