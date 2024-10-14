"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateTransactionSchema,
  UpdateTransactionSchema,
} from "@/lib/validations";
import { useGlobalContext } from "@/components/providers/global-context-provider";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/database-types";
import { UpdateTransactionForm } from "@/components/global/forms/update-transaction-form";
import { Loader2 } from "lucide-react";

type TransactionSheetProps = {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
};

export default function TransactionSheet({
  open,
  onClose,
  transaction,
}: TransactionSheetProps) {
  const { currentGroup } = useGlobalContext();
  const queryClient = useQueryClient();
  const [isUpdatePending, startUpdateTransition] = React.useTransition();

  const { data: categories } = useQuery({
    queryKey: ["categories", currentGroup?.id],
    queryFn: () =>
      fetch(`/api/categories/get?groupId=${currentGroup?.id}`).then((res) =>
        res.json()
      ),
  });

  const form = useForm<UpdateTransactionSchema>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      title: transaction.title,
      amount: Math.abs(transaction.amount),
      type: transaction.amount < 0 ? "expense" : "income",
      date: new Date(transaction.date),
      category: transaction.category?.id?.toString() || null,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: transaction.title,
        amount: Math.abs(transaction.amount),
        type: transaction.amount < 0 ? "expense" : "income",
        date: new Date(transaction.date),
        category: transaction.category?.id?.toString() || null,
      });
    }
  }, [open, transaction, form]);

  const onSubmit = async (data: UpdateTransactionSchema) => {
    startUpdateTransition(async () => {
      try {
        const response = await fetch("/api/transactions/update", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionId: transaction.id,
            transactionData: data,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message || "Failed to update transaction"
          );
        }

        toast.success("Transaction updated successfully");
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        onClose();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? `Server: ${error.message}`
            : "Server: An error occurred"
        );
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="gap-6 flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit transaction</SheetTitle>
          <SheetDescription>
            Make changes to your transaction here.
          </SheetDescription>
        </SheetHeader>
        <UpdateTransactionForm
          form={form}
          onSubmit={onSubmit}
          categories={categories}
        >
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isUpdatePending}>
              {isUpdatePending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </SheetFooter>
        </UpdateTransactionForm>
      </SheetContent>
    </Sheet>
  );
}
