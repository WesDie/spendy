import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UpdateEmailSchema } from "@/lib/validations";
import { UseFormReturn } from "react-hook-form";

export default function EmailForm({
  form,
}: {
  form: UseFormReturn<UpdateEmailSchema>;
}) {
  return (
    <>
      <FormField
        control={form.control}
        disabled
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
