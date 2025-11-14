import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, university, studentId } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          university: university,
          student_id: studentId,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      return NextResponse.json({
        message:
          "Registration successful. Please check your email to verify your account.",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: name,
          university: university,
          studentId: studentId,
          verified: false,
        },
      });
    }

    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
