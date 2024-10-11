import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json([], { status: 500 });
  }

  if (!groupId || !userData.user.id) {
    return NextResponse.json([], { status: 400 });
  }

  const { data: groupData, error: groupError } = await supabase
    .from("spendy_group_members")
    .select("*")
    .eq("group_id", groupId)
    .eq("user_id", userData.user.id);

  if (groupError) {
    return NextResponse.json([], { status: 500 });
  }

  if (!groupData) {
    return NextResponse.json([], { status: 404 });
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("spendy_categories")
    .select("*")
    .eq("group", groupId);

  if (categoriesError) {
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(categories, { status: 200 });
}
