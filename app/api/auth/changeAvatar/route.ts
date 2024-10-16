import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const fileExt = formData.get("fileExt") as string;

  // Check if file exceeds 1MB
  if (file.size > 1024 * 1024) {
    return NextResponse.json(
      { error: "File size exceeds 1 MB. Please choose a smaller file." },
      { status: 400 }
    );
  }

  const supabase = createClient();

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error("User not authenticated");
    }

    const { data: userProfileData, error: userProfileError } = await supabase
      .from("spendy_user_profiles")
      .select("display_name, avatar_url")
      .eq("id", userData.user.id)
      .single();

    if (userProfileError) {
      throw new Error("User profile not found");
    }

    const { display_name, avatar_url } = userProfileData;

    // Delete the old avatar if it exists
    if (avatar_url) {
      const { error: oldAvatarError } = await supabase.storage
        .from("icons")
        .remove([`user_icons/${avatar_url}`]);

      if (oldAvatarError) {
        console.error("Error deleting old avatar:", oldAvatarError);
      }
    }

    // Function to change the avatar image in the storage DB
    const { data, error } = await supabase.rpc("change_user_avatar", {
      p_user_id: userData.user.id,
      p_display_name: display_name,
      p_avatar_url: avatar_url, // can be NULL
      p_file_ext: fileExt,
    });

    if (error) {
      throw error;
    }

    // Upload the new avatar
    const { error: avatarError } = await supabase.storage
      .from("icons/user_icons")
      .upload(data.new_avatar_url, file);

    if (avatarError) {
      throw avatarError;
    }

    // Retrieve public URL for the new avatar
    const { data: publicUrlData } = supabase.storage
      .from("icons/user_icons")
      .getPublicUrl(data.new_avatar_url);

    return NextResponse.json(
      { data: { avatar_url: publicUrlData.publicUrl } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing avatar:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}
