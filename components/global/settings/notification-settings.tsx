import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import SettingsCard from "./elements/settings-card";

export default function NotificationSettings() {
  return (
    <>
      <SettingsCard
        title="Notifications"
        description="Change your notification settings."
      >
        <Card className="flex justify-between">
          <CardHeader>
            <CardTitle>Reminder emails</CardTitle>
            <CardDescription>
              Receive emails when you have not used your account for a while.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-fit p-0 pr-6 my-auto">
            <Switch id="activity-notifications" disabled />
          </CardContent>
        </Card>
        <Card className="flex justify-between">
          <CardHeader>
            <CardTitle>Activity emails</CardTitle>
            <CardDescription>
              Receive emails when there are important events on your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-fit p-0 pr-6 my-auto">
            <Switch id="activity-notifications" disabled />
          </CardContent>
        </Card>
        <Card className="flex justify-between">
          <CardHeader>
            <CardTitle>Marketing emails</CardTitle>
            <CardDescription>
              Receive marketing emails from the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-fit p-0 pr-6 my-auto">
            <Switch id="email-notifications" disabled />
          </CardContent>
        </Card>
        <Card className="flex justify-between">
          <CardHeader>
            <CardTitle>Security emails</CardTitle>
            <CardDescription>
              Receive security emails from the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-fit p-0 pr-6 my-auto">
            <Switch id="security-notifications" disabled checked />
          </CardContent>
        </Card>
        <Separator />
        <div className="flex justify-between gap-2 h-9">
          <Label
            htmlFor="theme"
            className="text-muted-foreground my-auto font-normal"
          >
            Update your notification settings.
          </Label>
          <Button className="w-fit">Update preferences</Button>
        </div>
      </SettingsCard>
    </>
  );
}
