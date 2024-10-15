"use client";
import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Transaction } from "@/types/database-types";

export function DeleteTransactionDialog({
  transactions,
  open,
  onClose,
}: {
  transactions: Transaction[];
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [isDeletePending, startDeleteTransition] = React.useTransition();

  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        const response = await fetch("/api/transactions/delete", {
          method: "DELETE",
          body: JSON.stringify({
            transactionData: transactions.map((t) => ({
              id: t.id,
              group: t.group,
            })),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error?.message || "Failed to delete transaction"
          );
        }

        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        toast.success("Transaction deleted");
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
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{`${transactions.length}`}</strong>{" "}
            {`transaction${transactions.length === 1 ? "" : "s"}`}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-500"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
