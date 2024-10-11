"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Timer } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { MoneyInput } from "@/components/ui/money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { Category } from "@/components/global/elements/categories-card";

type TransactionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function TransactionDialog({ open, onClose }: TransactionDialogProps) {
  const { currentGroup } = useGlobalContext();

  const { data: categories } = useQuery({
    queryKey: ["categories", currentGroup?.id],
    queryFn: () =>
      fetch(`/api/categories/get?groupId=${currentGroup?.id}`).then((res) =>
        res.json()
      ),
  });

  const [formData, setFormData] = useState({
    title: "",
    amount: 0,
    type: "expense",
    date: new Date(new Date().setSeconds(0)),
    group: currentGroup?.id,
    category: null as number | null,
  });
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", fields: [] as string[] });

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        title: "",
        amount: 0,
        type: "expense",
        date: new Date(new Date().setSeconds(0)),
        group: currentGroup?.id,
        category: null,
      });
      setIsSubmitting(false);
      setError({ message: "", fields: [] });
    }
  }, [open, currentGroup]);

  const handleCreate = () => {
    setIsSubmitting(true);
    fetch("/api/transactions/add", {
      method: "POST",
      body: JSON.stringify({
        transactionData: {
          title: formData.title,
          amount: formData.amount,
          type: formData.type,
          date: formData.date,
          group: formData.group,
          category: formData.category,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSubmitting(false);
        if (data.message === "Success") {
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          onClose();
        } else {
          setError(data.error);
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        setError(error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction to manage your expenses.
          </DialogDescription>
        </DialogHeader>
        {error.message && <Alert variant="destructive">{error.message}</Alert>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              placeholder="Transaction Title"
              className="col-span-3"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={error.fields?.includes("title")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Amount
            </Label>
            <MoneyInput
              id="name"
              placeholder="Transaction Amount"
              className="col-span-3"
              value={formData.amount}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  amount: value,
                })
              }
              currency="USD"
              error={error.fields?.includes("amount")}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Type
            </Label>
            <Select
              defaultValue="expense"
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">(+) Income</SelectItem>
                <SelectItem value="expense">(-) Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Category
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, category: Number(value) })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.icon + " " + category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP HH:mm:ss")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    const newDate = date || new Date();
                    newDate.setHours(12, 0, 0, 0);
                    setFormData({ ...formData, date: newDate });
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
                      picker="hours"
                      date={formData.date || new Date()}
                      ref={hourRef}
                      setDate={(date) =>
                        setFormData({ ...formData, date: date || new Date() })
                      }
                      onRightFocus={() => minuteRef.current?.focus()}
                    />
                    <span>:</span>
                    <TimePickerInput
                      picker="minutes"
                      date={formData.date || new Date()}
                      ref={minuteRef}
                      setDate={(date) =>
                        setFormData({ ...formData, date: date || new Date() })
                      }
                      onLeftFocus={() => hourRef.current?.focus()}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => handleCreate()}
            disabled={isSubmitting}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
