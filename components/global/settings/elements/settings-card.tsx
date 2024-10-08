import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsCard({
  title,
  description,
  children,
  isForm = false,
  handleSubmit,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  isForm?: boolean;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={!isForm ? "flex flex-col gap-4" : ""}>
        {isForm ? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {children}
          </form>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
