import { DatePickerWithRange } from "../elements/date-range-picker";
import InformationCard from "../elements/information-card";
import BigChart from "../elements/big-chart";
import ExpenseTable from "../elements/expenses-table";

export default function MainOverview() {
  return (
    <div className="flex flex-col h-full w-full gap-6 md:gap-10">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
        <h3 className="text-3xl font-semibold">Dashboard</h3>
        <DatePickerWithRange />
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full grid grid-rows-4 md:grid-rows-none md:grid-cols-4 gap-4">
          <InformationCard
            title="Total Income"
            value={1212.69}
            change="+20.1% from last month"
          />
          <InformationCard
            title="Total Expenses"
            value={-796.23}
            change="-10.1% from last month"
          />
          <InformationCard
            title="Total Profit"
            value={416.46}
            change="+20.1% from last month"
          />
          <InformationCard
            title="Total Profit Margin"
            value={20.1}
            change="+20.1% from last month"
            type="percentage"
          />
        </div>
        <BigChart />
        <ExpenseTable />
      </div>
    </div>
  );
}
