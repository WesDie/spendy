import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";

type TransactionData = {
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  group: number;
  category: number | null;
};

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { transactionData } = await req.json();

  const dateWithTimezone = new Date(transactionData.date);
  dateWithTimezone.setMinutes(
    dateWithTimezone.getMinutes() - dateWithTimezone.getTimezoneOffset()
  );
  transactionData.date = dateWithTimezone.toISOString();

  if (transactionData.type === "income") {
    transactionData.category = null;
  }

  // Validate transaction data
  const validationError = validateTransactionData(transactionData);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }

    // Insert transaction using RPC function
    const { data, error } = await supabase.rpc("create_transaction", {
      p_title: transactionData.title,
      p_amount:
        transactionData.type === "expense"
          ? -Math.abs(transactionData.amount)
          : Math.abs(transactionData.amount),
      p_date: transactionData.date,
      p_type: "payment",
      p_category: transactionData.category || null,
      p_group: transactionData.group,
      p_user_id: userData.user.id,
    });

    if (error) throw error;

    revalidateTag("transactions");

    return NextResponse.json(
      { message: "Success", transactionData: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

function validateTransactionData(transactionData: TransactionData): {
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
  if (!transactionData.group)
    return { message: "Group is required", fields: ["group"] };

  return null;
}
