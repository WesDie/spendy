export const generateDailyData = (
  startDate: Date,
  endDate: Date,
  data: any[]
) => {
  const dailyData = [];
  const dateMap = new Map();

  data.forEach((item) => {
    const date = new Date(item.created_at);
    date.setDate(date.getDate() + 1);
    const dateString = date.toDateString();
    if (dateMap.has(dateString)) {
      const existingItem = dateMap.get(dateString);
      if (item.amount > 0) {
        existingItem.income += item.amount;
      } else {
        existingItem.expenses += Math.abs(item.amount);
      }
    } else {
      dateMap.set(dateString, {
        ...item,
        date: dateString,
        income: item.amount > 0 ? item.amount : 0,
        expenses: item.amount < 0 ? Math.abs(item.amount) : 0,
      });
    }
  });

  let cumulativeIncome = 0;
  let cumulativeExpenses = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toDateString();
    if (dateMap.has(dateString)) {
      const item = dateMap.get(dateString);
      cumulativeIncome += item.income;
      cumulativeExpenses += item.expenses;
      dailyData.push({
        date: new Date(d).toISOString(),
        income: item.income,
        expenses: item.expenses,
        balance: cumulativeIncome - cumulativeExpenses,
      });
    } else {
      dailyData.push({
        date: new Date(d).toISOString(),
        income: 0,
        expenses: 0,
        balance: cumulativeIncome - cumulativeExpenses,
      });
    }
  }

  return dailyData;
};

export const aggregateData = (
  data: any[],
  aggregationType: "day" | "month" | "year",
  aggregationDays: number = 1
) => {
  const aggregatedData = data.reduce((acc, curr, index) => {
    const date = new Date(curr.date);
    let key;

    if (aggregationType === "day") {
      // day
      key = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - (index % aggregationDays)
      )
        .toISOString()
        .split("T")[0];
    } else if (aggregationType === "month") {
      // month
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    } else {
      // year
      key = `${date.getFullYear()}`;
    }

    if (!acc[key]) {
      acc[key] = { ...curr, date: key };
    } else {
      acc[key].income += curr.income;
      acc[key].expenses += curr.expenses;
      acc[key].balance = acc[key].balance + curr.income - curr.expenses;
      acc[key].date = key;
    }
    return acc;
  }, {});

  return Object.values(aggregatedData);
};

export const getTimeFormat = (activeDateOption: string) => {
  switch (activeDateOption) {
    case "month":
    case "halfyear":
    case "year":
      return "dd MMM";
    case "total":
      return "yyyy";
    default:
      return "dd MMM yyyy";
  }
};

export const firstTransactionDate = (data: any[]) =>
  new Date(
    data.reduce((earliest: Date, item: any) => {
      const date = new Date(item.created_at);
      return date < earliest ? date : earliest;
    }, new Date())
  );

export const today = new Date();

export const getDailyChartData = (data: any[]) =>
  generateDailyData(firstTransactionDate(data), today, data);
