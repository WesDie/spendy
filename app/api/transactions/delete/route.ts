import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

type TransactionData = {
  id: number;
  group: number;
};

export async function DELETE(req: NextRequest) {
  const supabase = createClient();

  const { transactionData } = await req.json();

  console.log(transactionData);

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

    // Delete transactions using RPC function
    const deletePromises = transactionData.map((transaction: TransactionData) =>
      supabase.rpc("delete_transaction", {
        p_transaction_id: transaction.id,
        p_group_id: transaction.group,
        p_user_id: userData.user.id,
      })
    );

    const results = await Promise.all(deletePromises);

    // Check if any deletion failed
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      throw new Error(`Failed to delete ${errors.length} transactions`);
    }

    revalidateTag("transactions");

    return NextResponse.json(
      {
        message: `${transactionData.length} transaction(s) deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction(s):", error);
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

function validateTransactionData(transactionData: TransactionData[]): {
  message: string;
  fields: string[];
} | null {
  if (!Array.isArray(transactionData) || transactionData.length === 0) {
    return {
      message: "Transaction data must be a non-empty array",
      fields: ["transactionData"],
    };
  }

  for (const transaction of transactionData) {
    if (!transaction.id) {
      return {
        message: "Transaction ID is required for all transactions",
        fields: ["id"],
      };
    }
    if (!transaction.group) {
      return {
        message: "Group ID is required for all transactions",
        fields: ["group"],
      };
    }
  }

  return null;
}
