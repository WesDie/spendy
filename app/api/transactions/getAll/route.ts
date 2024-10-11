import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json([], { status: 500 });
  }

  const { data: transactions, error: transactionsError } = await supabase
    .from("spendy_transactions")
    .select("*")
    .eq("user_id", userData?.user?.id ?? "")
    .eq("group", groupId ?? "");

  if (transactionsError) {
    return NextResponse.json([], { status: 500 });
  }

  if (transactions.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from("spendy_categories")
    .select("*")
    .eq("group", groupId ?? "");

  if (categoriesError) {
    return NextResponse.json([], { status: 500 });
  }

  // Add categories to transactions
  const transactionsWithCategory = transactions.map((transaction) => {
    const category = categories.find((c) => c.id === transaction.category);
    return { ...transaction, category };
  });

  return NextResponse.json(transactionsWithCategory, { status: 200 });
}
