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
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { usePathname } from "next/navigation";
import { Group } from "@/types/database-types";

export function GroupSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { openDialog } = useDialogs();
  const { currentGroup, setCurrentGroup } = useGlobalContext();
  const { data: groups, isLoading } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () =>
      fetch("/api/groups/getAll", { next: { tags: ["groups"] } }).then((res) =>
        res.json()
      ),
  });

  React.useEffect(() => {
    if (groups && groups.length > 0 && !currentGroup) {
      const pathSegments = pathname.split("/");
      const groupName = pathSegments[pathSegments.length - 1];
      const targetGroup = groups.find((group) => {
        return group.url === groupName;
      });
      if (targetGroup) {
        setCurrentGroup(targetGroup);
      } else {
        const personalGroup = groups.find((group) => group.type === "Personal");
        setCurrentGroup(personalGroup || null);
        if (pathname.includes("groups")) {
          router.push("/");
        }
      }
    }
  }, [groups, pathname, setCurrentGroup, currentGroup]);

  if (isLoading || groups?.length === 0)
    return <Skeleton className="h-[36px] w-[200px]" />;

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
            {currentGroup?.name +
              (currentGroup?.duplicateIndex
                ? ` (${currentGroup?.duplicateIndex})`
                : "") || "Select group..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          defaultValue={`${currentGroup?.name}${
            currentGroup?.duplicateIndex
              ? ` (${currentGroup?.duplicateIndex})`
              : ""
          }`}
        >
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
                )
                  .sort((a, b) =>
                    a === "Personal" ? -1 : b === "Personal" ? 1 : 0
                  )
                  .map((category, index) => (
                    <React.Fragment key={category}>
                      <CommandGroup heading={category}>
                        {groups
                          .filter((group) => group.type === category)
                          .map((group) => {
                            return (
                              <CommandItem
                                key={group.id}
                                value={`${group.name}${
                                  group.duplicateIndex
                                    ? ` (${group.duplicateIndex})`
                                    : ""
                                }`}
                                onSelect={() => {
                                  setCurrentGroup(group);
                                  if (group.type === "Personal") {
                                    router.push("/");
                                  } else {
                                    router.push(`/groups/${group.url}`);
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
                                  {group.duplicateIndex
                                    ? ` (${group.duplicateIndex})`
                                    : ""}
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
