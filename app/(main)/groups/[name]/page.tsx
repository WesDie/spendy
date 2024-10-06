"use client";
import { useGroupContext } from "@/components/providers/group-context-provider";

export default function GroupPage() {
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
    <div className="flex flex-col h-full w-full">
      <h3 className="text-2xl text-muted-foreground m-auto">
        Overview page ({groupName})
      </h3>
    </div>
  );
}
