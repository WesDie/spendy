"use client";

import * as React from "react";
import { addMonths, subMonths, format, isAfter } from "date-fns";
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

const options = [
  { label: "Month", value: "month" },
  { label: "3 Months", value: "3months" },
  { label: "Half Year", value: "halfyear" },
  { label: "Year", value: "year" },
  { label: "Total", value: "total" },
];

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [activeOption, setActiveOption] = React.useState("month");
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const handlePrev = () => {
    switch (activeOption) {
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "3months":
        setCurrentDate(subMonths(currentDate, 3));
        break;
      case "halfyear":
        setCurrentDate(subMonths(currentDate, 6));
        break;
      case "year":
        setCurrentDate(subMonths(currentDate, 12));
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    switch (activeOption) {
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "3months":
        setCurrentDate(addMonths(currentDate, 3));
        break;
      case "halfyear":
        setCurrentDate(addMonths(currentDate, 6));
        break;
      case "year":
        setCurrentDate(addMonths(currentDate, 12));
        break;
      default:
        break;
    }
  };

  const getDisplayDate = () => {
    switch (activeOption) {
      case "month":
        return format(currentDate, "MMM yyyy");
      case "3months":
        return `${format(subMonths(currentDate, 2), "MMM yyyy")} - ${format(
          currentDate,
          "MMM yyyy"
        )}`;
      case "halfyear":
        return `${format(subMonths(currentDate, 5), "MMM yyyy")} - ${format(
          currentDate,
          "MMM yyyy"
        )}`;
      case "year":
        return format(currentDate, "yyyy");
      case "total":
        return "All Time";
      default:
        return "";
    }
  };

  const isNextDisabled = () => {
    switch (activeOption) {
      case "month":
        return isAfter(addMonths(currentDate, 1), new Date());
      case "3months":
        return isAfter(addMonths(currentDate, 3), new Date());
      case "halfyear":
        return isAfter(addMonths(currentDate, 6), new Date());
      case "year":
        return isAfter(addMonths(currentDate, 12), new Date());
      case "total":
        return true;
      default:
        return false;
    }
  };

  const isPrevDisabled = () => {
    switch (activeOption) {
      case "total":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex gap-2 md:p-2 w-full overflow-hidden md:w-fit mx-auto">
        <Button
          onClick={handlePrev}
          variant="outline"
          disabled={isPrevDisabled()}
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
                  options.find((option) => option.value === activeOption)?.label
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
                        setActiveOption(currentValue);
                        setCurrentDate(new Date());
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          activeOption === option.value
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
          onClick={handleNext}
          variant="outline"
          disabled={isNextDisabled()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
