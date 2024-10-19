"use client";
import MainOverview from "@/components/global/pages/overview/main-overview";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import OverviewSkeleton from "@/components/global/pages/overview/overview-skeleton";
import { useEffect } from "react";

export default function Home() {
  const { currentGroup, setActiveDateOption, setUsePageSize } =
    useGlobalContext();

  useEffect(() => {
    setActiveDateOption("month");
    setUsePageSize(false);
  }, [setActiveDateOption, setUsePageSize]);

  if (!currentGroup) {
    return <OverviewSkeleton />;
  }

  return <MainOverview />;
}
