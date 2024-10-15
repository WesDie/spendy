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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PreferencesSettings() {
  return (
    <>
      <SettingsCard title="Preferences" description="Change your preferences.">
        <Card className="flex justify-between">
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Change the currency you want to use. Only effects your account not
              groups
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-fit p-0 pr-6 my-auto">
            <Select defaultValue="USD" disabled>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">($) USD</SelectItem>
                <SelectItem value="EUR">(€) EUR</SelectItem>
                <SelectItem value="GBP">(£) GBP</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Separator />
        <div className="flex justify-between gap-2 h-9">
          <Label
            htmlFor="theme"
            className="text-muted-foreground my-auto font-normal hidden sm:block"
          >
            Update your preferences.
          </Label>
          <Button className="w-fit" disabled>
            Update preferences
          </Button>
        </div>
      </SettingsCard>
    </>
  );
}
