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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const accounts = [
  {
    value: "MyAccount",
    label: "My Account",
    avatar: "https://github.com/wesdie.png",
    category: "Personal",
  },
  {
    value: "Account2",
    label: "Account 2",
    avatar: "https://github.com/github.png",
    category: "External",
  },
];

export function AccountSelector() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("MyAccount");

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
              <AvatarImage
                src={
                  accounts.find((account) => account.value === value)?.avatar
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {accounts.find((account) => account.value === value)?.label ||
              "Select account..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search accounts..." />
          <CommandList>
            <CommandEmpty>No accounts found.</CommandEmpty>
            {Object.keys(
              accounts.reduce(
                (acc: { [key: string]: (typeof account)[] }, account) => {
                  if (!acc[account.category]) {
                    acc[account.category] = [];
                  }
                  acc[account.category].push(account);
                  return acc;
                },
                {}
              )
            ).map((category, index) => (
              <React.Fragment key={category}>
                <CommandGroup heading={category}>
                  {accounts
                    .filter((account) => account.category === category)
                    .map((account) => (
                      <CommandItem
                        key={account.value}
                        value={account.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue);
                          setOpen(false);
                        }}
                        className="justify-between"
                      >
                        <div className="flex items-center">
                          <Avatar className="w-4 h-4 mr-2">
                            <AvatarImage src={account.avatar} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          {account.label}
                        </div>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === account.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  {index ===
                    Object.keys(
                      accounts.reduce(
                        (
                          acc: { [key: string]: (typeof account)[] },
                          account
                        ) => {
                          if (!acc[account.category]) {
                            acc[account.category] = [];
                          }
                          acc[account.category].push(account);
                          return acc;
                        },
                        {}
                      )
                    ).length -
                      1 && (
                    <>
                      <CommandSeparator className="my-2" />
                      <CommandItem>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                      </CommandItem>
                    </>
                  )}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
