"use client";
import MainOverview from "@/components/global/pages/overview/main-overview";
import OverviewSkeleton from "@/components/global/pages/overview/overview-skeleton";
import { useGlobalContext } from "@/components/providers/global-context-provider";

export default function GroupPage() {
  const { currentGroup } = useGlobalContext();

  if (!currentGroup) {
    return <OverviewSkeleton />;
  }

  return <MainOverview />;
}
