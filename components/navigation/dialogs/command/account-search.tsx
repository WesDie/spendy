import * as React from "react";
import { AlignEndHorizontal } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";

export function AccountSearch() {
  return null;

  return (
    <CommandGroup heading="Accounts">
      <CommandItem>
        <AlignEndHorizontal className="mr-2 h-4 w-4" />
        <span>Wes Diehl</span>
      </CommandItem>
      <CommandItem>
        <AlignEndHorizontal className="mr-2 h-4 w-4" />
        <span>John Doe</span>
      </CommandItem>
      <CommandItem>
        <AlignEndHorizontal className="mr-2 h-4 w-4" />
        <span>Jane Doe</span>
      </CommandItem>
    </CommandGroup>
  );
}
