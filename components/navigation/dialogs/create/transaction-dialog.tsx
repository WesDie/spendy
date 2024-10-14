"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createTransactionSchema,
  CreateTransactionSchema,
} from "@/lib/validations";
import { useGlobalContext } from "@/components/providers/global-context-provider";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateTransactionForm } from "@/components/global/forms/create-transaction-form";
import { DrawerClose } from "@/components/ui/drawer";
import { Loader2 } from "lucide-react";

type TransactionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function TransactionDialog({ open, onClose }: TransactionDialogProps) {
  const { currentGroup } = useGlobalContext();
  const queryClient = useQueryClient();
  const [isCreatePending, startCreateTransaction] = React.useTransition();

  const { data: categories } = useQuery({
    queryKey: ["categories", currentGroup?.id],
    queryFn: () =>
      fetch(`/api/categories/get?groupId=${currentGroup?.id}`).then((res) =>
        res.json()
      ),
  });

  const form = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      type: "expense",
      date: new Date(),
      category: null,
      group: currentGroup?.id,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(input: CreateTransactionSchema) {
    startCreateTransaction(async () => {
      input.group = currentGroup?.id;
      try {
        const response = await fetch("/api/transactions/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transactionData: input,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error?.message || "Failed to create transaction"
          );
        }

        toast.success("Transaction created");
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
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Create a new transaction to manage your expenses.
          </DialogDescription>
        </DialogHeader>
        <CreateTransactionForm
          form={form}
          onSubmit={onSubmit}
          categories={categories}
        >
          <DialogFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button type="submit" disabled={isCreatePending}>
              Create
              {isCreatePending && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </CreateTransactionForm>
      </DialogContent>
    </Dialog>
  );
}
