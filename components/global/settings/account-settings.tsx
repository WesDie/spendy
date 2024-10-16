"use client";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SettingsCard from "./elements/settings-card";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { changePasswordSchema } from "@/lib/validations";
import { toast } from "sonner";
import { ChangePasswordSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PasswordChangeForm from "./forms/password-change-form";

export default function AccountSettings() {
  const { user } = useGlobalContext();
  const [isPasswordChangePending, startPasswordChangeTransition] =
    React.useTransition();

  const changePasswordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const handleChangePassword = async (data: ChangePasswordSchema) => {
    startPasswordChangeTransition(async () => {
      try {
        const response = await fetch("/api/auth/changePassword", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || "Failed to change password");
        }

        toast.success("Password changed successfully");
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
        title="Email"
        description="Your email used by this account."
      >
        {user && (
          <Input
            type="text"
            id="email"
            placeholder="Enter your email"
            className="w-[400px]"
            disabled
            value={user?.email}
          />
        )}
        <Separator />
        <div className="justify-between gap-2 h-9 hidden sm:flex">
          <Label
            htmlFor="email"
            className="text-muted-foreground my-auto font-normal"
          >
            Your email is used to log in to your account. An email can only be
            changed via support.
          </Label>
        </div>
      </SettingsCard>
      <SettingsCard
        title="Change password"
        description="Change your password."
        label="Changes to your password will be reflected across your account."
        formProps={{
          component: <PasswordChangeForm form={changePasswordForm} />,
          buttonText: "Change Password",
          onSubmit: handleChangePassword,
          isPending: isPasswordChangePending,
          form: changePasswordForm,
        }}
      />
      <SettingsCard title="Full name" description="Change your full name.">
        <div className="flex gap-2">
          <Input
            type="text"
            id="first-name"
            placeholder="Enter your first name"
            className="w-[200px]"
            disabled
            value="First name"
          />
          <Input
            type="text"
            id="last-name"
            placeholder="Enter your last name"
            className="w-[200px]"
            disabled
            value="Last name"
          />
        </div>
        <Separator />
        <div className="flex justify-between gap-2 h-9">
          <Label
            htmlFor="email"
            className="text-muted-foreground my-auto font-normal hidden sm:block"
          >
            Your full name is used to identify you in the platform.
          </Label>
          <Button className="w-fit" disabled>
            Change full name
          </Button>
        </div>
      </SettingsCard>
    </>
  );
}
