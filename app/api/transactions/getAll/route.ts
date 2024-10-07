import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json([], { status: 500 });
  }

  const { data: transactions, error: transactionsError } = await supabase
    .from("spendy_transactions")
    .select("*")
    .eq("user_id", userData?.user?.id ?? "");

  if (transactionsError) {
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(transactions, { status: 200 });
}
