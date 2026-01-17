import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/user.services";

// PUT update password
export const PUT = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    const { current_password, new_password, confirm_password } =
      await req.json();

    // Validate input
    if (!current_password || !new_password || !confirm_password) {
      return NextResponse.json(
        { error: "All password fields are required" },
        { status: 400 },
      );
    }

    const result = await UserService.changePassword(user.userId, {
      current_password,
      new_password,
      confirm_password,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode },
      );
    }

    return NextResponse.json(result.data, { status: result.statusCode });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
