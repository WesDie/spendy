import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "50");

  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json(
      { error: "Failed to authenticate user", status: 500 },
      { status: 500 }
    );
  }

  let query = supabase
    .from("spendy_transactions")
    .select("*, category:spendy_categories(*)", { count: "exact" })
    .eq("user_id", userData?.user?.id ?? "")
    .eq("group", groupId ?? "")
    .order("date", { ascending: false });

  if (startDate && endDate) {
    query = query.gte("date", startDate).lte("date", endDate);
  }

  const {
    data: transactions,
    error: transactionsError,
    count,
  } = await query.range((page - 1) * pageSize, page * pageSize - 1);

  if (transactionsError) {
    return NextResponse.json(
      { error: "Failed to fetch transactions", status: 500 },
      { status: 500 }
    );
  }

  // Calculate total balance
  const { data: balanceData, error: balanceError } = await supabase
    .from("spendy_transactions")
    .select("amount.sum()")
    .eq("user_id", userData?.user?.id ?? "")
    .eq("group", groupId ?? "");

  if (balanceError) {
    return NextResponse.json(
      { error: "Failed to calculate total balance", status: 500 },
      { status: 500 }
    );
  }

  const totalBalance = balanceData[0]?.sum || 0;

  // Calculate balance before the selected period
  let balanceBeforePeriod = 0;
  if (startDate) {
    const { data: previousBalanceData, error: previousBalanceError } =
      await supabase
        .from("spendy_transactions")
        .select("amount.sum()")
        .eq("user_id", userData?.user?.id ?? "")
        .eq("group", groupId ?? "")
        .lt("date", startDate);

    if (previousBalanceError) {
      return NextResponse.json(
        { error: "Failed to calculate previous balance", status: 500 },
        { status: 500 }
      );
    }

    balanceBeforePeriod = previousBalanceData[0]?.sum || 0;
  }

  // Get most recent 5 transactions from all time
  const { data: recentTransactions, error: recentTransactionsError } =
    await supabase
      .from("spendy_transactions")
      .select("*, category:spendy_categories(*)")
      .eq("user_id", userData?.user?.id ?? "")
      .order("date", { ascending: false })
      .range(0, 4);

  if (recentTransactionsError) {
    return NextResponse.json(
      { error: "Failed to fetch recent transactions", status: 500 },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      transactions,
      totalBalance,
      balanceBeforePeriod,
      totalCount: count,
      currentPage: page,
      pageSize,
      recentTransactions,
    },
    { status: 200 }
  );
}
