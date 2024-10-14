import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { type CreateGroupSchema } from "@/lib/validations";

export const CreateGroupForm = ({
  form,
  onSubmit,
  isCreated,
  children,
}: {
  form: UseFormReturn<CreateGroupSchema>;
  onSubmit: (data: CreateGroupSchema) => void;
  isCreated: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {!isCreated && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Group Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {children}
      </form>
    </Form>
  );
};
