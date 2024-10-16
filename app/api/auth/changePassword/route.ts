import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export async function PATCH(req: NextRequest) {
  const supabase = createClient();
  const { currentPassword, newPassword } =
    (await req.json()) as ChangePasswordData;

  // Validate password data
  const validationError = validateChangePasswordData({
    currentPassword,
    newPassword,
  });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error("User not authenticated");
    }

    // Verify current password
    const { error: passwordError } = await supabase.auth.signInWithPassword({
      email: userData.user.email as string,
      password: currentPassword,
    });

    if (passwordError) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid current password",
            fields: ["currentPassword"],
          },
        },
        { status: 401 }
      );
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    revalidateTag("userProfile");

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: { message: "Failed to change password" } },
      { status: 500 }
    );
  }
}

function validateChangePasswordData(data: ChangePasswordData): {
  message: string;
  fields: string[];
} | null {
  if (!data.currentPassword)
    return {
      message: "Current password is required",
      fields: ["currentPassword"],
    };
  if (!data.newPassword)
    return { message: "New password is required", fields: ["newPassword"] };
  if (data.newPassword.length < 6)
    return {
      message: "New password must be at least 6 characters long",
      fields: ["newPassword"],
    };
  return null;
}
