import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ChangePasswordSchema } from "@/lib/validations";
import { UseFormReturn } from "react-hook-form";
import { useGlobalContext } from "@/components/providers/global-context-provider";

export default function PasswordChangeForm({
  form,
}: {
  form: UseFormReturn<ChangePasswordSchema>;
}) {
  const { user } = useGlobalContext();

  return (
    <>
      <Input
        type="text"
        id="username"
        disabled
        value={user?.email}
        autoComplete="username"
        className="hidden"
      />
      <FormField
        control={form.control}
        name="currentPassword"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Current Password"
                type="password"
                autoComplete="current-password"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="New Password"
                type="password"
                autoComplete="new-password"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
