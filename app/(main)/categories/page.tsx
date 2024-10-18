"use client";

import { CategoriesCard } from "@/components/global/elements/categories-card";
import { DatePickerWithRange } from "@/components/global/elements/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { useEffect } from "react";

export default function Categories() {
  const { currentGroup, setActiveDateOption } = useGlobalContext();

  useEffect(() => {
    setActiveDateOption("month");
  }, [setActiveDateOption]);

  if (!currentGroup) {
    return (
      <div className="flex flex-col h-full w-full gap-6 md:gap-10">
        <h3 className="text-xl sm:text-3xl font-semibold">Categories</h3>
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-6 md:gap-10">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <h3 className="text-xl sm:text-3xl font-semibold">Categories</h3>
        <DatePickerWithRange />
      </div>
      <div className="flex flex-col gap-4">
        <CategoriesCard />
      </div>
    </div>
  );
}
