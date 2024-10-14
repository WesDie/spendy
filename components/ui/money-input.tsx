import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/form";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
  id?: string;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  currency = "USD",
  placeholder = "0.00",
  className = "",

  id,
}) => {
  const [displayValue, setDisplayValue] = useState(value.toFixed(2));
  const { error } = useFormField();

  useEffect(() => {
    setDisplayValue(value.toFixed(2));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d]/g, "");

    if (input.length < displayValue.replace(/[^\d]/g, "").length) {
      input = input.slice(0) || "0";
    }

    input = input.padStart(3, "0");

    const dollars = parseInt(input.slice(0, -2)) || 0;
    const cents = input.slice(-2);
    const formattedValue = `${dollars}.${cents}`;

    const numericValue = parseFloat(formattedValue);
    onChange(numericValue);
    setDisplayValue(formattedValue);
  };

  const handleBlur = () => {
    setDisplayValue(value.toFixed(2));
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return "";
    }
  };

  return (
    <div className="relative flex items-center w-full col-span-3">
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={cn("pl-8 pr-16", className, {
          "border-red-500": error,
        })}
        id={id}
      />
      <span className="absolute left-3 text-muted-foreground">
        {getCurrencySymbol(currency)}
      </span>
      <span className="absolute right-3 bg-muted text-muted-foreground px-1 rounded text-xs">
        {currency}
      </span>
    </div>
  );
};
