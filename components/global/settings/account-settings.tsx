"use client";
import * as React from "react";

import SettingsCard from "./elements/settings-card";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import {
  changePasswordSchema,
  updateUserNameSchema,
  UpdateUserNameSchema,
  updateEmailSchema,
  UpdateEmailSchema,
} from "@/lib/validations";
import { toast } from "sonner";
import { ChangePasswordSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PasswordChangeForm from "./forms/password-change-form";
import UserNameForm from "./forms/user-name-form";
import { useQueryClient } from "@tanstack/react-query";
import EmailForm from "./forms/email-form";

export default function AccountSettings() {
  const queryClient = useQueryClient();
  const { user } = useGlobalContext();

  const [isPasswordChangePending, startPasswordChangeTransition] =
    React.useTransition();

  const [isUserNameChangePending, startUserNameChangeTransition] =
    React.useTransition();

  const [isEmailChangePending, startEmailChangeTransition] =
    React.useTransition();

  const changePasswordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const userNameForm = useForm<UpdateUserNameSchema>({
    resolver: zodResolver(updateUserNameSchema),
    defaultValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
    },
  });

  const emailForm = useForm<UpdateEmailSchema>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  React.useEffect(() => {
    userNameForm.reset({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
    });
  }, [user?.first_name, user?.last_name]);

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

  const handleChangeUserName = async (data: UpdateUserNameSchema) => {
    startUserNameChangeTransition(async () => {
      try {
        const response = await fetch("/api/auth/updateProfile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userData: {
              ...user,
              first_name: data.firstName,
              last_name: data.lastName,
            },
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error?.message || "Failed to update full name"
          );
        }

        queryClient.invalidateQueries({ queryKey: ["userProfile"] });

        toast.success("Full name updated successfully");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? `Server: ${error.message}`
            : "Server: An error occurred"
        );
      }
    });
  };

  const handleChangeEmail = async (data: UpdateEmailSchema) => {
    startEmailChangeTransition(async () => {
      toast.error("You cant change your email address yet.");
    });
  };

  return (
    <>
      <SettingsCard
        title="Email"
        description="This is the email used by this account."
        formProps={{
          component: <EmailForm form={emailForm} />,
          buttonText: "Change Email",
          onSubmit: handleChangeEmail,
          isPending: isEmailChangePending,
          form: emailForm,
        }}
      />
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
      <SettingsCard
        title="Full name"
        description="Change your full name."
        label="Changes to your full name will be reflected across your account."
        formProps={{
          component: <UserNameForm form={userNameForm} />,
          buttonText: "Change full name",
          onSubmit: handleChangeUserName,
          isPending: isUserNameChangePending,
          form: userNameForm,
        }}
      />
    </>
  );
}
