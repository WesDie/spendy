import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function InformationCard({
  title,
  value,
  change,
  type = "money",
  icon = <DollarSign />,
}: {
  title: string;
  value: number;
  change?: string;
  type?: "money" | "percentage";
  icon?: React.ReactNode;
}) {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2 text-muted-foreground w-4 h-4">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${
            value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : ""
          }`}
        >
          {type === "money"
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(value)
            : `${value}%`}
        </div>
        {change && <p className="text-xs text-muted-foreground">{change}</p>}
      </CardContent>
    </Card>
  );
}
