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

  for (const group of data) {
    const { data: imgUrl } = await supabase.storage
      .from("icons/group_icons")
      .getPublicUrl(`${group.icon || "default.jpg"}`);

    group.icon = imgUrl.publicUrl;

    const duplicateIndex =
      data.filter((g) => g.name === group.name).length > 1
        ? data.filter((g) => g.name === group.name).indexOf(group) + 1
        : "";

    group.url = `${group.name.replace(/\s+/g, "-").toLowerCase()}${
      duplicateIndex ? `:${duplicateIndex}` : ""
    }`;
    group.duplicateIndex = duplicateIndex;
  }

  return NextResponse.json(data, { status: 200 });
}
