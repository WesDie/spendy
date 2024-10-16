import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";
import { User } from "@/types/database-types";

export async function PATCH(req: NextRequest) {
  const supabase = createClient();
  const { userData } = (await req.json()) as { userData: User };

  // Validate transaction data
  const validationError = validateUpdateUserData(userData);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    // Check if the display_name is already used by another user
    const { data: existingUser, error: existingUserError } = await supabase
      .from("spendy_user_profiles")
      .select("id")
      .eq("display_name", userData.name)
      .neq("id", userData.id)
      .single();

    if (existingUserError && existingUserError.code !== "PGRST116")
      throw existingUserError;
    if (existingUser) {
      return NextResponse.json(
        { error: { message: "Display name is already in use" } },
        { status: 400 }
      );
    }

    // Update user data
    const { data, error } = await supabase
      .from("spendy_user_profiles")
      .update({
        display_name: userData.name,
        first_name: userData.first_name,
        last_name: userData.last_name,
      })
      .eq("id", userData.id);

    if (error) throw error;

    revalidateTag("userProfile");

    return NextResponse.json(
      { message: "User profile updated successfully", userData: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: { message: "Failed to update user profile" } },
      { status: 500 }
    );
  }
}

function validateUpdateUserData(userData: User): {
  message: string;
  fields: string[];
} | null {
  if (!userData.name)
    return { message: "Display name is required", fields: ["name"] };
  if (userData.name.length > 100)
    return {
      message: "Display name must be less than 100 characters",
      fields: ["name"],
    };
  if (!userData.first_name)
    return { message: "First name is required", fields: ["first_name"] };
  if (userData.first_name.length > 100)
    return {
      message: "First name must be less than 100 characters",
      fields: ["first_name"],
    };
  if (!userData.last_name)
    return { message: "Last name is required", fields: ["last_name"] };
  if (userData.last_name.length > 100)
    return {
      message: "Last name must be less than 100 characters",
      fields: ["last_name"],
    };
  return null;
}
