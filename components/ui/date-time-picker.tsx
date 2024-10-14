"use client";

import { useRef } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TimePickerInput } from "@/components/ui/time-picker-input";

export function DateTimePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal w-full",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          toDate={new Date()}
          mode="single"
          selected={date || new Date()}
          onSelect={(date) => {
            const newDate = date || new Date();
            newDate.setHours(12, 0, 0, 0);
            setDate(newDate);
          }}
          initialFocus
        />
        <div className="flex w-full justify-between px-4">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <Label htmlFor="hours">Time</Label>
          </div>
          <div className="p-3 flex items-center gap-2 border-t border-border">
            <TimePickerInput
              preventFutureTime={true}
              picker="hours"
              date={date || new Date()}
              ref={hourRef}
              setDate={(date) => setDate(date || new Date())}
              onRightFocus={() => minuteRef.current?.focus()}
            />
            <span>:</span>
            <TimePickerInput
              preventFutureTime={true}
              picker="minutes"
              date={date || new Date()}
              ref={minuteRef}
              setDate={(date) => setDate(date || new Date())}
              onLeftFocus={() => hourRef.current?.focus()}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
