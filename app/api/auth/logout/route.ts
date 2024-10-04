import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ message: "Success" }, { status: 200 });
}
