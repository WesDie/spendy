"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProjectSearch } from "./project-search";
import { GroupSearch } from "./group-search";
import {
  Search,
  ChartBarIncreasing,
  SettingsIcon,
  Sun,
  User,
  Moon,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  useCommandMenu,
  DialogType,
} from "@/components/providers/command-menu-provider";
import { useDialogs } from "@/components/providers/dialogs-provider";
import { useRouter } from "next/navigation";
export function CommandMenu({
  dialogType,
  onOpenChange,
}: {
  dialogType: DialogType;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const { openDialog } = useCommandMenu();
  const { openDialog: openCreateDialog } = useDialogs();
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openDialog(dialogType === "command" ? null : "command");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [openDialog, dialogType]);

  return (
    <>
      <CommandDialog
        open={dialogType === "command"}
        onOpenChange={onOpenChange}
      >
        <DialogTitle className="hidden">Command Menu</DialogTitle>
        <DialogDescription className="hidden">
          This is the command menu. You can use it to search for anything.
        </DialogDescription>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem disabled>
              <ChartBarIncreasing className="mr-2 h-4 w-4" />
              <span>My Groups</span>
              <CommandShortcut>⌘1</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                router.push("/settings");
                openDialog(null);
              }}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                openDialog(null);
              }}
            >
              {theme === "dark" ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              <span>
                Switch to &quot;{theme === "dark" ? "Light" : "Dark"} mode&quot;
              </span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Search">
            <CommandItem onSelect={() => openDialog("project")}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search Projects</span>
            </CommandItem>
            <CommandItem onSelect={() => openDialog("group")}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search Groups</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Create">
            <CommandItem onSelect={() => openCreateDialog("groupDialog")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create Group</span>
            </CommandItem>
            <CommandItem onSelect={() => openCreateDialog("transactionDialog")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create Transaction</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <SearchDialog
        open={dialogType === "project"}
        onOpenChange={() => openDialog(null)}
        title="Search Projects"
        description="Search through your projects."
        searchComponent={<ProjectSearch />}
      />

      <SearchDialog
        open={dialogType === "group"}
        onOpenChange={() => openDialog(null)}
        title="Search Groups"
        description="Search through your groups."
        searchComponent={<GroupSearch />}
      />
    </>
  );
}

function SearchDialog({
  open,
  onOpenChange,
  title,
  description,
  searchComponent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  searchComponent: React.ReactNode;
}) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="hidden">{title}</DialogTitle>
      <DialogDescription className="hidden">{description}</DialogDescription>
      <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {searchComponent}
      </CommandList>
    </CommandDialog>
  );
}
