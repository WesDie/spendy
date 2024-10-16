import * as React from "react";

import SettingsCard from "./elements/settings-card";
import AccountNotificationsForm from "./forms/notifications-form";
import { useForm } from "react-hook-form";
import { UpdateAccountNotificationsSchema } from "@/lib/validations";
import { toast } from "sonner";

export default function NotificationSettings() {
  const changeNotificationForm = useForm<UpdateAccountNotificationsSchema>();
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = async (data: UpdateAccountNotificationsSchema) => {
    startTransition(async () => {
      toast.error("You cant change your notification settings yet.");
    });
  };

  return (
    <SettingsCard
      title="Notifications"
      description="Change your notification settings."
      label="Update your notification settings."
      formProps={{
        component: <AccountNotificationsForm form={changeNotificationForm} />,
        buttonText: "Update preferences",
        onSubmit: handleSubmit,
        isPending: isPending,
        form: changeNotificationForm,
      }}
    />
  );
}
