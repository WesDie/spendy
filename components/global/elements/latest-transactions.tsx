import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Transaction } from "@/types/database-types";
import { useGlobalContext } from "@/components/providers/global-context-provider";

export default function LatestTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const { currentGroup } = useGlobalContext();
  const latestTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your most recent financial activities
          </CardDescription>
        </div>
        <Link
          href={
            currentGroup?.type === "Personal"
              ? "/transactions"
              : `/groups/${currentGroup?.url}/transactions`
          }
          className={buttonVariants({ variant: "outline" })}
        >
          View all transactions
        </Link>
      </CardHeader>
      <CardContent className="grid gap-6">
        {latestTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span role="img" aria-label="category icon" className="text-lg">
                {transaction.category?.icon ||
                  (transaction.amount > 0 ? "+" : "-")}
              </span>
            </div>
            <div className="flex-grow">
              <p className="">{transaction.title}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(transaction.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div
              className={`flex-shrink-0 ${
                transaction.amount > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {transaction.amount > 0 ? "+$" : "-$"}
              {Math.abs(transaction.amount).toFixed(2)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
