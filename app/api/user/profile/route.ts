import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET current user profile
export async function GET() {
  try {
    const supabase = createServerClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = {
      id: user.id,
      email: user.email || "",
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User",
      avatar: user.user_metadata?.avatar_url,
      university: user.user_metadata?.university,
      studentId: user.user_metadata?.student_id,
      verified: user.email_confirmed_at ? true : false,
    };

    return NextResponse.json({
      user: userProfile,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(req: NextRequest) {
  try {
    const { name, university, studentId } = await req.json();
    const supabase = createServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData: Record<string, string> = {};
    if (name) updateData.full_name = name;
    if (university !== undefined) updateData.university = university;
    if (studentId !== undefined) updateData.student_id = studentId;

    const { error } = await supabase.auth.updateUser({
      data: updateData,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const updatedProfile = {
      id: user.id,
      email: user.email || "",
      name:
        name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "User",
      avatar: user.user_metadata?.avatar_url,
      university: university || user.user_metadata?.university,
      studentId: studentId || user.user_metadata?.student_id,
      verified: user.email_confirmed_at ? true : false,
    };

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedProfile,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
