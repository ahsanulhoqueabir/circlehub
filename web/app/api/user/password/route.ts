import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import { NextRequest, NextResponse } from "next/server";
import { handleOptions, corsResponse } from "@/lib/cors";

export const OPTIONS = handleOptions;
import UserService from "@/services/user.services";

// PUT update password
export const PUT = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    const { current_password, new_password, confirm_password } =
      await req.json();

    // Validate input
    if (!current_password || !new_password || !confirm_password) {
      return corsResponse(
        { error: "All password fields are required" },
        { status: 400 }
      );
    }

    const result = await UserService.changePassword(user.userId, {
      current_password,
      new_password,
      confirm_password,
    });

    if (!result.success) {
      return corsResponse(
        { error: result.error },
        { status: result.statusCode }
      );
    }

    return corsResponse(result.data, { status: result.statusCode });
  } catch (error) {
    console.error("Change password error:", error);
    return corsResponse(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
