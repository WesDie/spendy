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

  // Validate group data
  const validationError = validateGroupData(groupData);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    // Get user data
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("User not authenticated");
    }

    groupData.icon = "default.jpg";

    // Insert group and member in a single transaction
    const { data, error } = await supabase.rpc("create_group_and_add_member", {
      p_group_name: groupData.name,
      p_group_type: groupData.type,
      p_icon: groupData.icon,
      p_user_id: userData.user.id,
    });

    if (error) throw error;

    const { data: imgUrl } = await supabase.storage
      .from("icons/group_icons")
      .getPublicUrl(`${data?.icon || "default.jpg"}`);

    data.icon = imgUrl.publicUrl;

    revalidateTag("groups");

    return NextResponse.json(
      { message: "Success", groupData: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

function validateGroupData(groupData: GroupData): {
  message: string;
  fields: string[];
} | null {
  if (!groupData.name)
    return { message: "Group name is required", fields: ["name"] };
  if (groupData.type !== "External")
    return { message: "Invalid group type", fields: ["type"] };
  if (groupData.name.toLowerCase() === "my account")
    return { message: "Group name cannot be 'My Account'", fields: ["name"] };

  const invalidChars = [":", "/", "\\", "?", "%", "*", "|", "<", ">", '"', " "];
  if (invalidChars.some((char) => groupData.name.includes(char)))
    return { message: "Invalid characters in group name", fields: ["name"] };
  if (groupData.name.length > 32)
    return {
      message: "Group name must be less than 32 characters",
      fields: ["name"],
    };
  if (groupData.name.length < 3)
    return {
      message: "Group name must be at least 3 characters",
      fields: ["name"],
    };

  return null;
}
