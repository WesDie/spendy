"use client";
import TransactionTable from "@/components/global/elements/transaction-table";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { useEffect } from "react";

export default function Transactions() {
  const { setActiveDateOption, setUsePageSize } = useGlobalContext();

  useEffect(() => {
    setActiveDateOption("total");
    setUsePageSize(true);
  }, [setActiveDateOption, setUsePageSize]);

  return (
    <div className="flex flex-col h-full w-full gap-6 md:gap-10">
      <h3 className="text-xl sm:text-3xl font-semibold">Transactions</h3>
      <div className="flex flex-col gap-4">
        <TransactionTable />
      </div>
    </div>
  );
}
