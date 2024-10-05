import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { groupData } = await req.json();

  if (!groupData.name) {
    return NextResponse.json(
      {
        error: {
          message: "Fill in the name field",
          fields: ["name"],
        },
      },
      { status: 400 }
    );
  }

  if (groupData.type !== "External") {
    return NextResponse.json(
      {
        error: {
          message: "Only external groups are supported",
          fields: [],
        },
      },
      { status: 400 }
    );
  }
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("spendy.groups")
    .insert({
      name: groupData.name,
      type: groupData.type,
      icon: groupData.icon,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data[0].id) {
    return NextResponse.json({ error: "Group ID not found" }, { status: 500 });
  }

  const { data: groupMemberData, error: groupMemberError } = await supabase
    .from("spendy.group_members")
    .insert({
      group_id: data[0].id,
      user_id: userData.user.id,
    });

  if (groupMemberError) {
    return NextResponse.json(
      { error: groupMemberError.message },
      { status: 500 }
    );
  }

  revalidateTag("groups");

  return NextResponse.json(
    { message: "Success", groupData: data },
    { status: 200 }
  );
}
