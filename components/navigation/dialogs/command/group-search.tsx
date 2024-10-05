import * as React from "react";
import { AlignEndHorizontal } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Group {
  id: string;
  name: string;
  type: string;
}

export function GroupSearch() {
  const { data: groups, isLoading } = useQuery<Group[], Error>({
    queryKey: ["groups"],
    queryFn: () =>
      fetch("/api/groups/getAll", { next: { tags: ["groups"] } }).then((res) =>
        res.json()
      ),
  });

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
                  .map((group) => (
                    <CommandItem key={group.id}>
                      <AlignEndHorizontal className="mr-2 h-4 w-4" />
                      <span>{group.name}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}
