import { NextRequest, NextResponse } from "next/server";
import { handleOptions, corsResponse } from "@/lib/cors";

export const OPTIONS = handleOptions;
import type { LoginRequest } from "@/types/auth.types";
import { AuthService } from "@/services/auth.services";

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequest = await req.json();

    const result = await AuthService.loginUser(body);

    if (result.success && result.data) {
      return corsResponse(result.data, { status: result.statusCode });
    }

    return corsResponse(
      { error: result.error },
      { status: result.statusCode }
    );
  } catch (error) {
    console.error("Login API error:", error);
    return corsResponse(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
