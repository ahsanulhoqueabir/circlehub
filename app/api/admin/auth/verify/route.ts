import { NextRequest, NextResponse } from "next/server";
import "@/lib/mongodb";
import "@/lib/init-models";
import { AdminService } from "@/services/admin.services";
import { JWTService } from "@/services/jwt.services";

/**
 * GET /api/admin/auth/verify
 * Verify admin authentication and return admin details
 */
export async function GET(req: NextRequest) {
  try {
    // Get authorization header
    const auth_header = req.headers.get("authorization");
    if (!auth_header || !auth_header.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "No authorization token provided",
        },
        { status: 401 },
      );
    }

    // Extract and verify token
    const token = auth_header.substring(7);
    const decoded = JWTService.verifyAccessToken(token);

    if (!decoded.valid || !decoded.payload?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: decoded.error || "Invalid or expired token",
        },
        { status: 401 },
      );
    }

    // Get admin details
    const result = await AdminService.getUserById(decoded.payload.userId);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error || "User is not an admin",
        },
        { status: result.statusCode },
      );
    }

    const admin = result.data as {
      _id: string;
      user_id: string;
      role: string;
      permissions: string[];
      last_login?: Date;
      is_active: boolean;
    };

    // Check if admin is active
    if (!admin.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin account is deactivated",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin authenticated",
        data: {
          admin_id: admin._id,
          user_id: admin.user_id,
          role: admin.role,
          permissions: admin.permissions,
          last_login: admin.last_login,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error verifying admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify admin authentication",
      },
      { status: 500 },
    );
  }
}
