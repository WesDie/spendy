import * as React from "react";
import { AlignEndHorizontal } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useCommandMenu } from "@/components/providers/command-menu-provider";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { Group } from "@/types/database-types";

export function GroupSearch() {
  const { data: groups, isLoading } = useQuery<Group[], Error>({
    queryKey: ["groups"],
    queryFn: () =>
      fetch("/api/groups/getAll", { next: { tags: ["groups"] } }).then((res) =>
        res.json()
      ),
  });

  const { openDialog } = useCommandMenu();
  const router = useRouter();
  const { setCurrentGroup } = useGlobalContext();
  if (isLoading)
    return <Skeleton className="h-[36px] w-[200px] bg-secondary" />;

  return (
    <>
      {groups && (
        <>
          {Object.keys(
            groups.reduce((acc: { [key: string]: (typeof group)[] }, group) => {
              if (!acc[group.type]) {
                acc[group.type] = [];
              }
              acc[group.type].push(group);
              return acc;
            }, {})
          ).map((category, index) => (
            <React.Fragment key={category}>
              <CommandGroup heading={category}>
                {groups
                  .filter((group) => group.type === category)
                  .map((group) => {
                    return (
                      <CommandItem
                        key={group.id}
                        value={`${group.name}${
                          group.duplicateIndex ? `:${group.duplicateIndex}` : ""
                        }`}
                        onSelect={() => {
                          setCurrentGroup(group);
                          if (group.type === "Personal") {
                            router.push("/");
                          } else {
                            router.push(`/groups/${group.url}`);
                          }
                          openDialog(null);
                        }}
                      >
                        <AlignEndHorizontal className="mr-2 h-4 w-4" />
                        <span>
                          {group.name}
                          {group.duplicateIndex
                            ? ` (${group.duplicateIndex})`
                            : ""}
                        </span>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}
