"use client";

import * as React from "react";
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useGlobalContext } from "@/components/providers/global-context-provider";
const options = [
  { label: "Month", value: "month" },
  { label: "Half Year", value: "halfyear" },
  { label: "Year", value: "year" },
  { label: "Total", value: "total" },
];

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const {
    activeDateOption,
    setActiveDateOption,
    setCurrentDate,
    handleDatePrev,
    handleDateNext,
    getDisplayDate,
    isNextDateDisabled,
    isPrevDateDisabled,
  } = useGlobalContext();

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex gap-2 md:p-2 w-full overflow-hidden md:w-fit mx-auto">
        <Button
          onClick={handleDatePrev}
          variant="outline"
          disabled={isPrevDateDisabled()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full overflow-hidden md:w-[280px] justify-between"
            >
              <p className="text-sm w-[85%] text-left overflow-hidden text-ellipsis">
                {`${
                  options.find((option) => option.value === activeDateOption)
                    ?.label
                } (${getDisplayDate()})`}
              </p>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-[280px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No date range found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setActiveDateOption(currentValue as any);
                        setCurrentDate(new Date());
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          activeDateOption === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          onClick={handleDateNext}
          variant="outline"
          disabled={isNextDateDisabled()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
