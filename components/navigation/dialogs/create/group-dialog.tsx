"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGlobalContext } from "@/components/providers/global-context-provider";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useQueryClient } from "@tanstack/react-query";
import { createGroupSchema, type CreateGroupSchema } from "@/lib/validations";
import { CreateGroupForm } from "@/components/global/forms/create-group-form";
import { Check, Copy, Loader2 } from "lucide-react";

type GroupDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function GroupDialog({ open, onClose }: GroupDialogProps) {
  const queryClient = useQueryClient();
  const [isCreatePending, startCreateGroup] = React.useTransition();
  const [isCreated, setIsCreated] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { setCurrentGroup } = useGlobalContext();

  const form = useForm<CreateGroupSchema>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: "", type: "External" },
  });

  async function onSubmit(input: CreateGroupSchema) {
    startCreateGroup(async () => {
      try {
        const response = await fetch("/api/groups/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupData: input,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Failed to create group");
        }

        toast.success("Created group");
        setIsCreated(true);
        setShareLink(
          `https://spendy-mu.vercel.app/groups/${data.groupData.id}`
        );
        queryClient.invalidateQueries({ queryKey: ["groups"] });
        router.push(`/groups/${data.groupData.id}`);
        data.groupData.name = data.groupData.name.split(":")[0];
        setCurrentGroup(data.groupData);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? `Server: ${error.message}`
            : "Server: An error occurred"
        );
      }
    });
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    if (open) {
      form.reset();
      setIsCreated(false);
      setShareLink("");
      setCopied(false);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreated ? `"${form.watch("name")}" created` : "Create Group"}
          </DialogTitle>
          <DialogDescription>
            {isCreated
              ? "You can now invite your contacts to the group via this link:"
              : "Create a new group to manage your expenses."}
          </DialogDescription>
        </DialogHeader>
        <CreateGroupForm form={form} onSubmit={onSubmit} isCreated={isCreated}>
          {isCreated && (
            <div className="w-full">
              <div className="flex items-center space-x-2 mt-4">
                <Input value={shareLink} readOnly />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  disabled={copied}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            {isCreated ? (
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            ) : (
              <>
                <DrawerClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit" disabled={isCreatePending}>
                  {isCreatePending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create
                </Button>
              </>
            )}
          </DialogFooter>
        </CreateGroupForm>
      </DialogContent>
    </Dialog>
  );
}
