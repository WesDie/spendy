"use client";
import MainOverview from "@/components/global/pages/overview/main-overview";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import OverviewSkeleton from "@/components/global/pages/overview/overview-skeleton";

export default function Home() {
  const { currentGroup } = useGlobalContext();

  if (!currentGroup) {
    return <OverviewSkeleton />;
  }

  return <MainOverview />;
}
