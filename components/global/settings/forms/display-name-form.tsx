import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UpdateDisplayNameSchema } from "@/lib/validations";
import { UseFormReturn } from "react-hook-form";

export default function DisplayNameForm({
  form,
}: {
  form: UseFormReturn<UpdateDisplayNameSchema>;
}) {
  return (
    <>
      <FormField
        control={form.control}
        name="displayName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Display Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
