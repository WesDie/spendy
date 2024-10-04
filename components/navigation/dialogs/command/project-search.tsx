import * as React from "react";
import { AlignEndHorizontal } from "lucide-react";
import { CommandGroup, CommandItem } from "@/components/ui/command";

export function ProjectSearch() {
  return null;
  return (
    <CommandGroup heading="Projects">
      <CommandItem>
        <AlignEndHorizontal className="mr-2 h-4 w-4" />
        <span>Project 1</span>
      </CommandItem>
      <CommandItem>
        <AlignEndHorizontal className="mr-2 h-4 w-4" />
        <span>Project 2</span>
      </CommandItem>
      <CommandItem>
        <AlignEndHorizontal className="mr-2 h-4 w-4" />
        <span>Project 3</span>
      </CommandItem>
    </CommandGroup>
  );
}
