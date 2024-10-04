import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const formData = await req.json();
  const email = formData.email;
  const password = formData.password;
  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const requiredFields = [email, password, firstName, lastName];

  // Check if all fields are filled
  if (requiredFields.some((field) => !field)) {
    return NextResponse.json(
      {
        error: {
          message: "Fill in all fields",
          fields: requiredFields
            .map((field, index) =>
              field
                ? null
                : ["email", "password", "firstName", "lastName"][index]
            )
            .filter(Boolean),
        },
      },
      { status: 400 }
    );
  }

  // Password must be at least 6 characters
  if (password.length < 6) {
    return NextResponse.json(
      {
        error: {
          message: "Password must be at least 6 characters",
          fields: ["password"],
        },
      },
      { status: 400 }
    );
  }

  // Check if email is valid
  if (!email.includes("@")) {
    return NextResponse.json(
      {
        error: {
          message: "Invalid email",
          fields: ["email"],
        },
      },
      { status: 400 }
    );
  }

  const supabase = createClient();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: "http://localhost:3000/login?confirm=true",
    },
  });

  if (signUpError) {
    if (signUpError.code === "duplicate_email") {
      return NextResponse.json(
        {
          error: {
            message: "Email already exists",
            fields: ["email"],
          },
        },
        { status: 400 }
      );
    }

    if (signUpError.code === "email_address_not_authorized") {
      return NextResponse.json(
        {
          error: {
            message: "Email not authorized",
            fields: ["email"],
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong", fields: ["email"] },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Success" }, { status: 200 });
}
