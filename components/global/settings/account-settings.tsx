import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SettingsCard from "./elements/settings-card";
import { useGlobalContext } from "@/components/providers/global-context-provider";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export default function AccountSettings() {
  const { user } = useGlobalContext();

  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordError, setPasswordError] = useState({
    message: "",
    fields: [] as string[],
  });

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/auth/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordFormData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setPasswordError(data.error);
        } else {
          setPasswordError({
            message: "",
            fields: [],
          });
          setPasswordSuccess("Password changed successfully");
          setPasswordFormData({
            currentPassword: "",
            newPassword: "",
          });

          setTimeout(() => {
            setPasswordSuccess(null);
          }, 5000);
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
        <div className="flex justify-between gap-2 h-9">
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
        title="Password"
        description="Change your password."
        isForm
        handleSubmit={handleChangePassword}
      >
        {passwordError.message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Password change failed</AlertTitle>
            <AlertDescription>{passwordError.message}</AlertDescription>
          </Alert>
        )}
        {passwordSuccess && (
          <Alert variant="success">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Password changed successfully</AlertTitle>
            <AlertDescription>{passwordSuccess}</AlertDescription>
          </Alert>
        )}
        <Input
          type="text"
          id="username"
          disabled
          value={user?.email}
          autoComplete="username"
          className="hidden"
        />

        <Input
          type="password"
          id="current-password"
          placeholder="Enter your current password"
          className="w-[400px]"
          autoComplete="current-password"
          value={passwordFormData.currentPassword}
          onChange={(e) =>
            setPasswordFormData({
              ...passwordFormData,
              currentPassword: e.target.value,
            })
          }
          error={passwordError.fields.includes("currentPassword")}
        />
        <Input
          type="password"
          id="password"
          placeholder="Enter your new password"
          className="w-[400px]"
          autoComplete="new-password"
          value={passwordFormData.newPassword}
          onChange={(e) =>
            setPasswordFormData({
              ...passwordFormData,
              newPassword: e.target.value,
            })
          }
          error={passwordError.fields.includes("newPassword")}
        />
        <Separator />
        <div className="flex justify-between gap-2 h-9">
          <Label
            htmlFor="password"
            className="text-muted-foreground my-auto font-normal"
          >
            Your password is used to log in to your account.
          </Label>
          <Button
            className="w-fit"
            disabled={
              !passwordFormData.currentPassword || !passwordFormData.newPassword
            }
          >
            Change password
          </Button>
        </div>
      </SettingsCard>
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
            className="text-muted-foreground my-auto font-normal"
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
