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
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type GroupDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function GroupDialog({ open, onClose }: GroupDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "External",
  });
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({ message: "", fields: [] as string[] });

  const handleCreate = () => {
    setIsSubmitting(true);
    fetch("/api/groups/add", {
      method: "POST",
      body: JSON.stringify({
        groupData: {
          name: formData.name,
          type: formData.type,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsSubmitting(false);
        if (data.message === "Success") {
          onClose();
          queryClient.invalidateQueries({ queryKey: ["groups"] });
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
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Create a new group to manage your expenses.
          </DialogDescription>
        </DialogHeader>
        {error.message && <Alert variant="destructive">{error.message}</Alert>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Group Name"
              className="col-span-3"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={error.fields?.includes("name")}
            />
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
