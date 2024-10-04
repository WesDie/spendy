import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const formData = await req.json();
  const email = formData.email;
  const password = formData.password;
  const requiredFields = [email, password];

  if (requiredFields.some((field) => !field)) {
    return NextResponse.json(
      {
        error: {
          message: "Fill in all fields",
          fields: requiredFields
            .map((field, index) =>
              field ? null : ["email", "password"][index]
            )
            .filter(Boolean),
        },
      },
      { status: 401 }
    );
  }

  const supabase = createClient();

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

  if (signInError) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid email or password",
          fields: ["email", "password"],
        },
      },
      { status: 401 }
    );
  }

  if (signInData.user) {
    return NextResponse.json({ message: "Success" }, { status: 200 });
  }

  return NextResponse.json(
    {
      error: {
        message: "Invalid email or password",
        fields: ["email", "password"],
      },
    },
    { status: 401 }
  );
}
