import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/user.services";

// DELETE user account
export const DELETE = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required to delete account" },
        { status: 400 },
      );
    }

    const result = await UserService.deleteAccount(user.userId, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.statusCode },
      );
    }

    return NextResponse.json(result.data, { status: result.statusCode });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
