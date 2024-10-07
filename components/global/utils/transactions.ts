import { Transaction } from "../overview/main-overview";

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
      return transaction.amount > 0 &&
        new Date(transaction.created_at) >= timeframe.startDate &&
        new Date(transaction.created_at) <= timeframe.endDate
        ? acc + transaction.amount
        : acc;
    },
    0
  );

  const totalSpend = transactions.reduce(
    (acc: number, transaction: Transaction) => {
      return transaction.amount < 0 &&
        new Date(transaction.created_at) >= timeframe.startDate &&
        new Date(transaction.created_at) <= timeframe.endDate
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
