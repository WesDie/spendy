"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useDialogs } from "@/components/providers/dialogs-provider";
import { useRouter } from "next/navigation";
import { useGroupContext } from "@/components/providers/group-context-provider";
import { usePathname } from "next/navigation";

type Group = {
  id: number;
  name: string;
  icon: string;
  type: "Personal" | "External";
};

export function GroupSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { openDialog } = useDialogs();
  const { currentGroup, setCurrentGroup } = useGroupContext();
  const { data: groups, isLoading } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () =>
      fetch("/api/groups/getAll", { next: { tags: ["groups"] } }).then((res) =>
        res.json()
      ),
  });

  React.useEffect(() => {
    if (groups && groups.length > 0 && !currentGroup) {
      const groupName = pathname.split("/").pop();
      const [baseName, duplicateIndex] = groupName?.split(":") || [
        groupName,
        "",
      ];
      const targetGroup = groups.find((group) => {
        return (
          group.name === baseName &&
          (!duplicateIndex ||
            groups.filter((g) => g.name === baseName).indexOf(group) ===
              parseInt(duplicateIndex) - 1)
        );
      });
      if (targetGroup) {
        setCurrentGroup(targetGroup);
      } else {
        setCurrentGroup(groups[0]);
      }
    }
  }, [groups, pathname, setCurrentGroup, currentGroup]);

  if (isLoading || groups?.length === 0)
    return <Skeleton className="h-[36px] w-[200px] bg-secondary" />;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center">
            <Avatar className="w-4 h-4 mr-2">
              <AvatarImage src={currentGroup?.icon} />
              <AvatarFallback>{currentGroup?.name[0]}</AvatarFallback>
            </Avatar>
            {currentGroup?.name || "Select group..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            {groups && (
              <>
                {Object.keys(
                  groups.reduce(
                    (acc: { [key: string]: (typeof group)[] }, group) => {
                      if (!acc[group.type]) {
                        acc[group.type] = [];
                      }
                      acc[group.type].push(group);
                      return acc;
                    },
                    {}
                  )
                ).map((category, index) => (
                  <React.Fragment key={category}>
                    <CommandGroup heading={category}>
                      {groups
                        .filter((group) => group.type === category)
                        .map((group) => {
                          const duplicateIndex =
                            groups.filter((g) => g.name === group.name).length >
                            1
                              ? groups
                                  .filter((g) => g.name === group.name)
                                  .indexOf(group) + 1
                              : "";
                          return (
                            <CommandItem
                              key={group.id}
                              value={group.id.toString()}
                              onSelect={() => {
                                setCurrentGroup(group);
                                if (group.type === "Personal") {
                                  router.push("/");
                                } else {
                                  router.push(
                                    `/groups/${group.name}${
                                      duplicateIndex ? `:${duplicateIndex}` : ""
                                    }`
                                  );
                                }
                                setOpen(false);
                              }}
                              className="justify-between"
                            >
                              <div className="flex items-center">
                                <Avatar className="w-4 h-4 mr-2">
                                  <AvatarImage src={group.icon} />
                                  <AvatarFallback>
                                    {group.name[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {group.name}
                                {duplicateIndex ? ` (${duplicateIndex})` : ""}
                              </div>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  currentGroup?.id === group.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          );
                        })}
                      {index ===
                        Object.keys(
                          groups.reduce(
                            (
                              acc: { [key: string]: (typeof group)[] },
                              group
                            ) => {
                              if (!acc[group.type]) {
                                acc[group.type] = [];
                              }
                              acc[group.type].push(group);
                              return acc;
                            },
                            {}
                          )
                        ).length -
                          1 && (
                        <>
                          <CommandSeparator className="my-2" />
                          <CommandItem
                            onSelect={() => openDialog("groupDialog")}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create New
                          </CommandItem>
                        </>
                      )}
                    </CommandGroup>
                  </React.Fragment>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
