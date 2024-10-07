"use client";
import MainOverview from "@/components/global/overview/main-overview";
import { useGroupContext } from "@/components/providers/group-context-provider";

export default function Home() {
  const { currentGroup } = useGroupContext();

  const groupName = currentGroup?.name;

  if (!currentGroup) {
    return (
      <div className="flex flex-col h-full w-full">
        <h3 className="text-2xl text-muted-foreground m-auto">Loading...</h3>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-full w-full p-6 px-4 md:p-8">
      <MainOverview />
    </main>
  );
}
