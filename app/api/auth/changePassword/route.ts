import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
export async function POST(req: Request) {
  const { currentPassword, newPassword } = await req.json();
  const supabase = createClient();

  if (!newPassword) {
    return NextResponse.json(
      {
        error: {
          message: "New password is required",
          fields: ["newPassword"],
        },
      },
      { status: 400 }
    );
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json(
      {
        error: {
          message: "Something went wrong",
          fields: [],
        },
      },
      { status: 500 }
    );
  }

  const { data: passwordData, error: passwordError } =
    await supabase.auth.signInWithPassword({
      email: userData.user.email as string,
      password: currentPassword,
    });

  if (passwordError) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid password",
          fields: ["currentPassword"],
        },
      },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return NextResponse.json(
      {
        error: {
          message: "Something went wrong",
          fields: [],
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Password changed" });
}
