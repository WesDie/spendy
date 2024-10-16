import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UpdateAccountNotificationsSchema } from "@/lib/validations";
import { UseFormReturn } from "react-hook-form";

const notificationOptions = [
  {
    id: "reminderEmails",
    title: "Reminder emails",
    description:
      "Receive emails when you have not used your account for a while.",
  },
  {
    id: "activityEmails",
    title: "Activity emails",
    description:
      "Receive emails when there are important events on your account.",
  },
  {
    id: "newsletterEmails",
    title: "Newsletter emails",
    description: "Receive newsletter emails from the platform.",
  },
  {
    id: "securityEmails",
    title: "Security emails",
    description: "Receive security emails from the platform.",
  },
];

export default function AccountNotificationsForm({
  form,
}: {
  form: UseFormReturn<UpdateAccountNotificationsSchema>;
}) {
  return (
    <>
      {notificationOptions.map((option) => (
        <FormField
          key={option.id}
          control={form.control}
          disabled
          name={option.id as keyof UpdateAccountNotificationsSchema}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Card className="flex justify-between">
                  <CardHeader>
                    <CardTitle>{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex h-fit p-0 pr-6 my-auto">
                    <Switch {...field} value={field.value ? "on" : "off"} />
                  </CardContent>
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
}
