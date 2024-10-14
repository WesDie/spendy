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
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { toast } from "sonner";

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
  const [isCreated, setIsCreated] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { setCurrentGroup } = useGlobalContext();

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        type: "External",
      });
      setIsSubmitting(false);
      setError({ message: "", fields: [] });
      setIsCreated(false);
      setShareLink("");
      setCopied(false);
    }
  }, [open]);

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
          toast.success("Created group");
          setIsCreated(true);
          setShareLink(
            `https://spendy-mu.vercel.app/groups/${data.groupData.id}`
          );
          queryClient.invalidateQueries({ queryKey: ["groups"] });
          router.push(`/groups/${data.groupData.id}`);
          data.groupData.name = data.groupData.name.split(":")[0];
          setCurrentGroup(data.groupData);
        } else {
          toast.error(data.error.message);
          setError(data.error);
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        setError(error);
      });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isCreated ? `${formData.name} created` : "Create Group"}
          </DialogTitle>
          <DialogDescription>
            {isCreated
              ? "You can now share the group with contacts via this link."
              : "Create a new group to manage your expenses."}
          </DialogDescription>
        </DialogHeader>
        {isCreated ? (
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
        ) : (
          <>
            {error.message && (
              <Alert variant="destructive">{error.message}</Alert>
            )}
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
          </>
        )}
        <DialogFooter>
          {isCreated ? (
            <Button onClick={onClose}>Close</Button>
          ) : (
            <Button
              type="submit"
              onClick={() => handleCreate()}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
