import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";

type UpdateTransactionData = {
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  category: number | null;
};

export async function PATCH(req: NextRequest) {
  const supabase = createClient();
  const { transactionId, transactionData } = await req.json();

  if (transactionData.type === "income") {
    transactionData.category = null;
  }

  const dateWithTimezone = new Date(transactionData.date);
  dateWithTimezone.setMinutes(
    dateWithTimezone.getMinutes() - dateWithTimezone.getTimezoneOffset()
  );
  transactionData.date = dateWithTimezone.toISOString();

  // Validate transaction data
  const validationError = validateUpdateTransactionData(transactionData);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    // Get user data
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    // Update transaction using RPC function
    const { data, error } = await supabase.rpc("update_transaction", {
      p_transaction_id: transactionId,
      p_title: transactionData.title,
      p_amount:
        transactionData.type === "expense"
          ? -Math.abs(transactionData.amount)
          : Math.abs(transactionData.amount),
      p_date: transactionData.date,
      p_category: transactionData.category,
      p_user_id: userData.user.id,
    });

    if (error) throw error;

    revalidateTag("transactions");

    return NextResponse.json(
      { message: "Transaction updated successfully", transactionData: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: { message: "Failed to update transaction" } },
      { status: 500 }
    );
  }
}

function validateUpdateTransactionData(
  transactionData: UpdateTransactionData
): {
  message: string;
  fields: string[];
} | null {
  if (!transactionData.title)
    return { message: "Transaction title is required", fields: ["title"] };
  if (transactionData.title.length > 100)
    return {
      message: "Transaction title must be less than 100 characters",
      fields: ["title"],
    };
  if (
    typeof transactionData.amount !== "number" ||
    isNaN(transactionData.amount)
  )
    return { message: "Invalid amount", fields: ["amount"] };
  if (transactionData.type !== "income" && transactionData.type !== "expense")
    return { message: "Invalid transaction type", fields: ["type"] };
  if (!transactionData.date)
    return { message: "Transaction date is required", fields: ["date"] };

  return null;
}
