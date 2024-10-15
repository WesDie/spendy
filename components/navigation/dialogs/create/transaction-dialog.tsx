"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";

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
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerContent,
  DrawerClose,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CreateTransactionForm } from "@/components/global/forms/create-transaction-form";
import { Loader2 } from "lucide-react";

type TransactionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function TransactionDialog({ open, onClose }: TransactionDialogProps) {
  const { currentGroup } = useGlobalContext();
  const queryClient = useQueryClient();
  const [isCreatePending, startCreateTransaction] = React.useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");
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
      date: new Date(new Date().setSeconds(0)),
      category: null,
      group: currentGroup?.id,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
      form.setValue("date", new Date(new Date().setSeconds(0)));
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

  if (isDesktop) {
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
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
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

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create Transaction</DrawerTitle>
          <DrawerDescription>
            Create a new transaction to manage your expenses.
          </DrawerDescription>
        </DrawerHeader>
        <CreateTransactionForm
          form={form}
          onSubmit={onSubmit}
          categories={categories}
        >
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button type="submit" disabled={isCreatePending}>
              {isCreatePending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </DrawerFooter>
        </CreateTransactionForm>
      </DrawerContent>
    </Drawer>
  );
}
