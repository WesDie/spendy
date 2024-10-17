"use client";

import TransactionTable from "@/components/global/elements/transaction-table";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function Transactions() {
  const { currentGroup } = useGlobalContext();

  const { data: transactions } = useQuery({
    queryKey: ["transactions", currentGroup?.id],
    queryFn: () =>
      fetch(`/api/transactions/getAll?groupId=${currentGroup?.id}`).then(
        (res) => res.json()
      ),
  });

  if (!transactions) {
    return (
      <div className="flex flex-col h-full w-full gap-6 md:gap-10">
        <h3 className="text-xl sm:text-3xl font-semibold">Transactions</h3>
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-6 md:gap-10">
      <h3 className="text-xl sm:text-3xl font-semibold">Transactions</h3>
      <div className="flex flex-col gap-4">
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
