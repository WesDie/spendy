import { Transaction } from "@/types/database-types";

export function getAllTransactionData(
  transactions: Transaction[],
  timeframe: { startDate: Date; endDate: Date }
) {
  const totalBalance = transactions.reduce(
    (acc: number, transaction: Transaction) => {
      return acc + transaction.amount;
    },
    0
  );

  const totalIncome = transactions.reduce(
    (acc: number, transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setDate(transactionDate.getDate() - 1); // Retract transaction date by one day
      return transaction.amount > 0 &&
        transactionDate >= timeframe.startDate &&
        transactionDate <= timeframe.endDate
        ? acc + transaction.amount
        : acc;
    },
    0
  );

  const totalSpend = transactions.reduce(
    (acc: number, transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setDate(transactionDate.getDate() - 1); // Retract transaction date by one day
      return transaction.amount < 0 &&
        transactionDate >= timeframe.startDate &&
        transactionDate <= timeframe.endDate
        ? acc + transaction.amount
        : acc;
    },
    0
  );

  const totalProfit =
    totalIncome === 0 || totalSpend === 0
      ? null
      : Math.round(((totalIncome - totalSpend) / totalIncome) * 100 * 100) /
        100;

  return { totalBalance, totalIncome, totalSpend, totalProfit };
}
