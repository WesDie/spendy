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
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select, SelectItem } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { UpdateAccountPreferencesSchema } from "@/lib/validations";
import { UseFormReturn } from "react-hook-form";

const preferencesOptions = [
  {
    id: "currency",
    title: "Currency",
    description:
      "Change the currency you want to use. Only effects your account not groups",
    defaultValue: "USD",
    options: ["USD", "EUR", "GBP"],
  },
];

export default function AccountPreferencesForm({
  form,
}: {
  form: UseFormReturn<UpdateAccountPreferencesSchema>;
}) {
  return (
    <>
      {preferencesOptions.map((option) => (
        <FormField
          key={option.id}
          control={form.control}
          disabled
          name={option.id as keyof UpdateAccountPreferencesSchema}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Card className="flex justify-between">
                  <CardHeader>
                    <CardTitle>{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex h-fit p-0 pr-6 my-auto">
                    <Select defaultValue={option.defaultValue} disabled>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {option.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
