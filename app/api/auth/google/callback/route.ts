import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/services/auth.services";
import { JWTService } from "@/services/jwt.services";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email } = body;

    if (!userId || !email) {
      return NextResponse.json(
        { error: "User ID and email are required" },
        { status: 400 }
      );
    }

    // Fetch user data from database
    const result = await getCurrentUser(userId);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { error: result.error || "Failed to fetch user data" },
        { status: result.statusCode }
      );
    }

    // Generate JWT token
    const token = JWTService.generateJWTToken({
      id: result.data.user.id,
      email: result.data.user.email,
      role: result.data.user.role,
    });

    return NextResponse.json(
      {
        user: result.data.user,
        token: token,
        message: "Google authentication successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google callback API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
