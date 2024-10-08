import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError }, { status: 500 });
  }

  return NextResponse.json(userData.user, { status: 200 });
}
