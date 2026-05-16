import { NextRequest, NextResponse } from "next/server";
import { handleOptions, corsResponse } from "@/lib/cors";

export const OPTIONS = handleOptions;
import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import { AuthService } from "@/services/auth.services";

export const GET = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    const result = await AuthService.getCurrentUser(user.userId);

    if (result.success && result.data) {
      return corsResponse(result.data, { status: result.statusCode });
    }

    return corsResponse(
      { error: result.error },
      { status: result.statusCode }
    );
  } catch (error) {
    console.error("Get current user API error:", error);
    return corsResponse(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
