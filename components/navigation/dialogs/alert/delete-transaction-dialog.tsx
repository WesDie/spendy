"use client";
import { Transaction } from "@/components/global/overview/main-overview";

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

export function DeleteTransactionDialog({
  transaction,
  open,
  onClose,
}: {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    fetch("/api/transactions/delete", {
      method: "DELETE",
      body: JSON.stringify({ transaction: transaction }),
    }).then(() => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-500"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
