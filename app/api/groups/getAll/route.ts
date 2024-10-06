import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json([], { status: 500 });
  }

  const { data: groups, error: groupsError } = await supabase
    .from("spendy_group_members")
    .select("*")
    .eq("user_id", userData?.user?.id ?? "");

  if (groupsError) {
    return NextResponse.json([], { status: 500 });
  }

  const { data, error } = await supabase
    .from("spendy_groups")
    .select("*")
    .in("id", groups?.map((group) => group.group_id) ?? []);

  if (error) {
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
