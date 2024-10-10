import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type TransactionData = {
  title: string;
  amount: number;
  date: Date;
  type: string;
};

export async function POST(req: Request) {
  const supabase = createClient();
  const { transactionData } = await req.json();

  const errors = validateTransactionData(transactionData);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: { message: "Validation failed", fields: errors } },
      { status: 400 }
    );
  }

  const dateWithTimezone = new Date(transactionData.date);
  dateWithTimezone.setMinutes(
    dateWithTimezone.getMinutes() - dateWithTimezone.getTimezoneOffset()
  );
  transactionData.date = dateWithTimezone.toISOString();

  if (transactionData.type === "expense") {
    transactionData.amount = -transactionData.amount;
  }

  const { data, error } = await supabase.from("spendy_transactions").insert({
    title: transactionData.title,
    amount: transactionData.amount,
    date: transactionData.date,
    category: "Test",
    group: transactionData.group,
  });

  if (error) {
    return NextResponse.json(
      { error: { message: "Something went wrong", fields: [] } },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Success" }, { status: 200 });
}

function validateTransactionData(transactionData: TransactionData) {
  const errors = [];

  if (!transactionData.title) {
    errors.push("title");
  }

  if (!transactionData.amount) {
    errors.push("amount");
  }

  if (!transactionData.date) {
    errors.push("date");
  }

  return errors;
}
