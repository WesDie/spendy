import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types/database-types";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  const { data: userProfileData, error: userProfileError } = await supabase
    .from("spendy_user_profiles")
    .select("*")
    .eq("id", userData.user?.id);

  if (userProfileError) {
    return NextResponse.json({ error: userProfileError }, { status: 500 });
  }

  const { data: avatarUrl } = await supabase.storage
    .from("icons/user_icons")
    .getPublicUrl(userProfileData[0].avatar_url);

  const user: User = {
    id: userData.user?.id ?? "",
    email: userData.user?.email ?? "",
    name: userProfileData[0].display_name ?? "",
    first_name: userProfileData[0].first_name ?? "",
    last_name: userProfileData[0].last_name ?? "",
    avatar_url: avatarUrl.publicUrl ?? "",
  };

  if (userError) {
    return NextResponse.json({ error: userError }, { status: 500 });
  }

  return NextResponse.json(user, { status: 200 });
}
