import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const supabase = createClient();

  const { transactionId, transactionData } = await req.json();

  if (transactionData.type === "income") {
    transactionData.category = null;
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existingTransaction, error: transactionError } = await supabase
    .from("spendy_transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (transactionError || !existingTransaction) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }

  const { data: groupMember, error: groupError } = await supabase
    .from("spendy_group_members")
    .select("*")
    .eq("group_id", existingTransaction.group)
    .eq("user_id", userData.user.id)
    .single();

  if (groupError || !groupMember) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    transactionData.amount = -Math.abs(transactionData.amount);
  } else {
    transactionData.amount = Math.abs(transactionData.amount);
  }

  const { data, error } = await supabase
    .from("spendy_transactions")
    .update({
      title: transactionData.title,
      amount: transactionData.amount,
      date: transactionData.date,
      category: transactionData.category,
    })
    .eq("id", transactionId);

  if (error) {
    return NextResponse.json(
      { error: { message: "Failed to update transaction", fields: [] } },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Transaction updated successfully" });
}

function validateTransactionData(transactionData: any) {
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

  if (!transactionData.type) {
    errors.push("type");
  }

  if (transactionData.type !== "income" && !transactionData.category) {
    errors.push("category");
  }

  return errors;
}
