import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartControlsProps {
  chartType: "balance" | "incomeExpenses";
  onChartTypeChange: (type: "balance" | "incomeExpenses") => void;
  displayOption: "both" | "income" | "expenses";
  onDisplayOptionChange: (option: "both" | "income" | "expenses") => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  onChartTypeChange,
  displayOption,
  onDisplayOptionChange,
}) => {
  const handleChartTypeChange = (type: "balance" | "incomeExpenses") => {
    onChartTypeChange(type);
    localStorage.setItem("chartType", type);
  };

  const handleDisplayOptionChange = (
    option: "both" | "income" | "expenses"
  ) => {
    onDisplayOptionChange(option);
    localStorage.setItem("displayOption", option);
  };

  return (
    <div className="flex flex-col items-start mb-4 space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
      {chartType === "incomeExpenses" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {displayOption === "both"
                ? "Income & Expenses"
                : displayOption === "income"
                ? "Income"
                : "Expenses"}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={displayOption}
              onValueChange={(value) =>
                handleDisplayOptionChange(
                  value as "both" | "income" | "expenses"
                )
              }
            >
              <DropdownMenuRadioItem value="both">
                Income & Expenses
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="income">
                Income
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="expenses">
                Expenses
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Select value={chartType} onValueChange={handleChartTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select chart type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="balance">Balance</SelectItem>
          <SelectItem value="incomeExpenses">Expenses / Income</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
