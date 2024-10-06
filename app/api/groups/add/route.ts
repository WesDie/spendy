import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";

type GroupData = {
  name: string;
  type: string;
  icon: string;
};

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { groupData } = await req.json();

  const errors = validateGroupData(groupData);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: { message: "Validation failed", fields: errors } },
      { status: 400 }
    );
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("spendy_groups")
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
    .from("spendy_group_members")
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
    { message: "Success", groupData: data[0] },
    { status: 200 }
  );
}

function validateGroupData(groupData: GroupData) {
  const errors = [];

  if (!groupData.name) {
    errors.push("name");
  }

  if (groupData.type !== "External") {
    errors.push("type");
  }

  if (groupData.name.toLowerCase() === "my account") {
    errors.push("name");
  }

  const invalidChars = [":", "/", "\\", "?", "%", "*", "|", "<", ">", '"', " "];
  if (invalidChars.some((char) => groupData.name.includes(char))) {
    errors.push("name");
  }

  if (groupData.name.length > 32) {
    errors.push("name");
  }

  if (groupData.name.length < 3) {
    errors.push("name");
  }

  return errors;
}
