import { Button } from "@/components/ui/button";
import { useCommandMenu } from "@/components/providers/command-menu-provider";
import { CommandShortcut } from "@/components/ui/command";
import { Search } from "lucide-react";

export function SearcInput() {
  const { openDialog: openDialogType } = useCommandMenu();

  return (
    <>
      <Button
        variant="outline"
        className="justify-start gap-2 text-muted-foreground min-w-[250px] hidden md:flex"
        onClick={() => openDialogType("command")}
      >
        <Search className="h-4 w-4" /> Search...
        <CommandShortcut>⌘J</CommandShortcut>
      </Button>
      <Button variant="ghost" size="icon" className="md:hidden">
        <Search className="h-4 w-4" />
      </Button>
    </>
  );
}
