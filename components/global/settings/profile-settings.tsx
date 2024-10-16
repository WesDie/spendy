"use client";
import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateDisplayNameSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { updateDisplayNameSchema } from "@/lib/validations";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import SettingsCard from "./elements/settings-card";
import UserAvatar from "../elements/avatar";
import DisplayNameForm from "./forms/display-name-form";

export default function ProfileSettings() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = React.useTransition();
  const { user } = useGlobalContext();

  const updateDisplayNameForm = useForm<UpdateDisplayNameSchema>({
    resolver: zodResolver(updateDisplayNameSchema),
    defaultValues: {
      displayName: user?.name || "",
    },
  });

  React.useEffect(() => {
    updateDisplayNameForm.reset({ displayName: user?.name || "" });
  }, [user?.name]);

  const onSubmit = async (data: UpdateDisplayNameSchema) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/updateProfile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userData: {
              ...user,
              name: data.displayName,
            },
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message || "Failed to update display name"
          );
        }

        toast.success("Display name updated successfully");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
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
    <>
      <SettingsCard
        title="Avatar"
        description="Change your avatar."
        label="An avatar is optional but strongly recommended."
      >
        <UserAvatar isChangeable size="large" />
      </SettingsCard>
      <SettingsCard
        title="Display Name"
        description="This is the name that will be displayed to other users."
        label="Changes to your display name will be reflected across your account."
        formProps={{
          component: <DisplayNameForm form={updateDisplayNameForm} />,
          buttonText: "Update Display Name",
          onSubmit: onSubmit,
          isPending: isPending,
          form: updateDisplayNameForm,
        }}
      />
    </>
  );
}
