import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import CountUp from "react-countup";
import { useGlobalContext } from "@/components/providers/global-context-provider";

export default function InformationCard({
  title,
  value,
  change,
  type = "money",
  icon = <DollarSign />,
}: {
  title: string;
  value: number | null;
  change?: string;
  type?: "money" | "percentage";
  icon?: React.ReactNode;
}) {
  const { isTransactionsLoading: isLoading } = useGlobalContext();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0.2 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={isLoading ? "animate-pulse" : ""}
    >
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground w-4 h-4">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          {value !== null ? (
            <div
              className={`text-2xl font-bold ${
                value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : ""
              }`}
            >
              {type === "money" ? (
                <CountUp
                  start={0}
                  end={value}
                  duration={1}
                  separator=","
                  decimals={2}
                  decimal="."
                  prefix="$"
                />
              ) : (
                <CountUp
                  start={0}
                  end={value}
                  duration={1}
                  separator=","
                  decimals={2}
                  decimal="."
                  suffix="%"
                />
              )}
            </div>
          ) : (
            <div className="text-2xl font-bold text-muted-foreground">---</div>
          )}
          {change && <p className="text-xs text-muted-foreground">{change}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
