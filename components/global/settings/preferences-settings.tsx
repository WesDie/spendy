import * as React from "react";

import SettingsCard from "./elements/settings-card";
import { useForm } from "react-hook-form";
import { UpdateAccountPreferencesSchema } from "@/lib/validations";
import { toast } from "sonner";
import AccountPreferencesForm from "./forms/account-preferences-form";

export default function PreferencesSettings() {
  const changePreferencesForm = useForm<UpdateAccountPreferencesSchema>();
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = async (data: UpdateAccountPreferencesSchema) => {
    startTransition(async () => {
      toast.error("You cant change your account preferences yet.");
    });
  };

  return (
    <>
      <SettingsCard
        title="Preferences"
        description="Change your account preferences."
        label="Update your account preferences."
        formProps={{
          component: <AccountPreferencesForm form={changePreferencesForm} />,
          buttonText: "Update preferences",
          onSubmit: handleSubmit,
          isPending: isPending,
          form: changePreferencesForm,
        }}
      />
    </>
  );
}
