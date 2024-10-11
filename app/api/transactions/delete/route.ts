import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const supabase = createClient();

  const { transaction } = await req.json();

  if (!transaction) {
    return NextResponse.json(
      { error: "Transaction ID is required" },
      { status: 400 }
    );
  }

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: userGroup, error: userGroupError } = await supabase
    .from("spendy_group_members")
    .select("group_id")
    .eq("group_id", transaction.group)
    .eq("user_id", user.user.id);

  if (userGroupError) {
    return NextResponse.json(
      { error: userGroupError.message },
      { status: 500 }
    );
  }

  if (!userGroup || userGroup.length === 0) {
    return NextResponse.json(
      { error: "User is not part of a group" },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from("spendy_transactions")
    .delete()
    .eq("id", transaction.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Transaction deleted successfully" });
}
