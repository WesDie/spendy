import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";

export default function SettingsCard({
  title,
  description,
  children,
  label,
  formProps,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  label?: string;
  formProps?: {
    component?: React.ReactNode;
    buttonText?: string;
    onSubmit?: (data: any) => Promise<void>;
    isPending?: boolean;
    form?: any;
  };
}) {
  const handleSubmit = formProps?.form
    ? formProps.form.handleSubmit(formProps.onSubmit)
    : formProps?.onSubmit;
  const hasChanges = formProps?.form
    ? Object.values(formProps.form.formState.dirtyFields).some((field) => field)
    : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {formProps?.component ? (
          <Form {...formProps.form}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {formProps.component}
              {label && (
                <>
                  <Separator />
                  <div className="flex justify-between gap-2 h-9">
                    <Label className="text-muted-foreground my-auto font-normal hidden sm:block">
                      {label}
                    </Label>
                    <Button
                      type="submit"
                      className="w-fit"
                      disabled={formProps.isPending || !hasChanges}
                    >
                      {formProps.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {formProps.buttonText || "Save"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        ) : (
          <>
            {children}
            {label && (
              <>
                <Separator />
                <div className="flex justify-between gap-2 h-9">
                  <Label className="text-muted-foreground my-auto font-normal hidden sm:block">
                    {label}
                  </Label>
                  {formProps?.onSubmit && (
                    <Button
                      onClick={formProps?.onSubmit}
                      className="w-fit"
                      disabled={formProps?.isPending}
                    >
                      {formProps?.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {formProps?.buttonText || "Save"}
                    </Button>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
