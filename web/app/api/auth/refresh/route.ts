import { NextRequest, NextResponse } from "next/server";
import { handleOptions, corsResponse } from "@/lib/cors";

export const OPTIONS = handleOptions;
import type { RefreshTokenRequest } from "@/types/auth.types";
import { AuthService } from "@/services/auth.services";

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export async function POST(req: NextRequest) {
  try {
    const body: RefreshTokenRequest = await req.json();

    if (!body.refreshToken) {
      return corsResponse(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    const result = await AuthService.refreshAccessToken(body.refreshToken);

    if (result.success && result.data) {
      return corsResponse(result.data, { status: result.statusCode });
    }

    return corsResponse(
      { error: result.error },
      { status: result.statusCode }
    );
  } catch (error) {
    console.error("Refresh token API error:", error);
    return corsResponse(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
