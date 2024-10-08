import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SettingsCard from "./elements/settings-card";

export default function AccountSettings() {
  return (
    <>
      <SettingsCard
        title="Email"
        description="Your email used by this account."
      >
        <Input
          type="text"
          id="email"
          placeholder="Enter your email"
          className="w-[400px]"
          disabled
          value="wesdie@gmail.com"
        />
        <Separator />
        <div className="flex justify-between gap-2 h-9">
          <Label
            htmlFor="email"
            className="text-muted-foreground my-auto font-normal"
          >
            Your email is used to log in to your account. An email can only be
            changed via support.
          </Label>
          <Button className="w-fit" disabled>
            Change email
          </Button>
        </div>
      </SettingsCard>
      <SettingsCard title="Password" description="Change your password.">
        <Input
          type="password"
          id="current-password"
          placeholder="Enter your current password"
          className="w-[400px]"
          disabled
        />
        <Input
          type="password"
          id="password"
          placeholder="Enter your new password"
          className="w-[400px]"
          disabled
        />
        <Separator />
        <div className="flex justify-between gap-2 h-9">
          <Label
            htmlFor="password"
            className="text-muted-foreground my-auto font-normal"
          >
            Your password is used to log in to your account.
          </Label>
          <Button className="w-fit" disabled>
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
            value="Wes"
          />
          <Input
            type="text"
            id="last-name"
            placeholder="Enter your last name"
            className="w-[200px]"
            disabled
            value="Dieleman"
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
      <Alert variant="destructive" className="flex flex-col gap-4 p-6">
        <AlertTitle className="text-lg font-semibold text-foreground">
          Delete account
        </AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          Deleting your account is irreversible and will remove all of your data
          from our servers.
        </AlertDescription>
        <Separator />
        <Button variant="destructive" className="w-fit" disabled>
          Delete account
        </Button>
      </Alert>
    </>
  );
}
