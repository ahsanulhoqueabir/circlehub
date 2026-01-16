import { NextRequest, NextResponse } from "next/server";
import { JWTService } from "@/services/jwt.services";
import { AdminService } from "@/services/admin.services";

interface AdminData {
  _id: string;
  user_id: string;
  role: string;
  permissions: string[];
  is_active: boolean;
}

/**
 * Admin Authentication Middleware
 * Verifies that the user is an authenticated admin with appropriate permissions
 */

export interface AdminAuthRequest extends NextRequest {
  user_id?: string;
  admin_id?: string;
  admin_role?: string;
  permissions?: string[];
}

/**
 * Middleware to verify admin authentication and authorization
 * @param required_permission - Optional specific permission required
 * @returns Middleware function
 */
export function with_admin_auth(required_permission?: string) {
  return async (
    req: NextRequest,
    handler: (req: AdminAuthRequest) => Promise<NextResponse>
  ) => {
    try {
      // Get authorization header
      const auth_header = req.headers.get("authorization");
      if (!auth_header || !auth_header.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            success: false,
            message: "No authorization token provided",
          },
          { status: 401 }
        );
      }

      // Extract and verify token
      const token = auth_header.substring(7);
      const decoded = JWTService.verifyAccessToken(token);

      if (!decoded || !decoded.payload?.userId) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token",
          },
          { status: 401 }
        );
      }

      // Get admin details
      const admin_response = await AdminService.getAdminByUserId(
        decoded.payload.userId
      );
      if (!admin_response.success || !admin_response.data) {
        return NextResponse.json(
          {
            success: false,
            message: admin_response.error || "User is not an admin",
          },
          { status: admin_response.statusCode || 403 }
        );
      }

      const admin = admin_response.data as AdminData;

      // Check if admin is active
      if (!admin.is_active) {
        return NextResponse.json(
          {
            success: false,
            message: "Admin account is deactivated",
          },
          { status: 403 }
        );
      }

      // Check specific permission if required
      if (required_permission) {
        if (!admin.permissions.includes(required_permission)) {
          return NextResponse.json(
            {
              success: false,
              message: `Permission denied. Required: ${required_permission}`,
            },
            { status: 403 }
          );
        }
      }

      // Add admin info to request
      const admin_req = req as AdminAuthRequest;
      admin_req.user_id = decoded.payload.userId;
      admin_req.admin_id = admin._id.toString();
      admin_req.admin_role = admin.role;
      admin_req.permissions = admin.permissions;

      // Call the handler
      return await handler(admin_req);
    } catch (error) {
      console.error("Admin auth middleware error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper to check multiple permissions (user must have at least one)
 */
export function with_admin_auth_any(required_permissions: string[]) {
  return async (
    req: NextRequest,
    handler: (req: AdminAuthRequest) => Promise<NextResponse>
  ) => {
    try {
      // Get authorization header
      const auth_header = req.headers.get("authorization");
      if (!auth_header || !auth_header.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            success: false,
            message: "No authorization token provided",
          },
          { status: 401 }
        );
      }

      // Extract and verify token
      const token = auth_header.substring(7);
      const decoded = JWTService.verifyAccessToken(token);

      if (!decoded || !decoded.payload?.userId) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token",
          },
          { status: 401 }
        );
      }

      // Get admin details
      const admin_response = await AdminService.getAdminByUserId(
        decoded.payload?.userId
      );
      if (!admin_response.success || !admin_response.data) {
        return NextResponse.json(
          {
            success: false,
            message: admin_response.error || "User is not an admin",
          },
          { status: admin_response.statusCode || 403 }
        );
      }

      const admin = admin_response.data as AdminData;

      // Check if admin is active
      if (!admin.is_active) {
        return NextResponse.json(
          {
            success: false,
            message: "Admin account is deactivated",
          },
          { status: 403 }
        );
      }

      // Check if admin has at least one of the required permissions
      const has_permission = required_permissions.some((perm) =>
        admin.permissions.includes(perm)
      );

      if (!has_permission) {
        return NextResponse.json(
          {
            success: false,
            message: `Permission denied. Required one of: ${required_permissions.join(
              ", "
            )}`,
          },
          { status: 403 }
        );
      }

      // Add admin info to request
      const admin_req = req as AdminAuthRequest;
      admin_req.user_id = decoded.payload.userId;
      admin_req.admin_id = admin._id.toString();
      admin_req.admin_role = admin.role;
      admin_req.permissions = admin.permissions;

      // Call the handler
      return await handler(admin_req);
    } catch (error) {
      console.error("Admin auth middleware error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper to check if user has a specific role
 */
export function with_admin_role(
  required_role: "super_admin" | "moderator" | "support_staff"
) {
  return async (
    req: NextRequest,
    handler: (req: AdminAuthRequest) => Promise<NextResponse>
  ) => {
    try {
      // Get authorization header
      const auth_header = req.headers.get("authorization");
      if (!auth_header || !auth_header.startsWith("Bearer ")) {
        return NextResponse.json(
          {
            success: false,
            message: "No authorization token provided",
          },
          { status: 401 }
        );
      }

      // Extract and verify token
      const token = auth_header.substring(7);
      const decoded = JWTService.verifyAccessToken(token);

      if (!decoded || !decoded.payload?.userId) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token",
          },
          { status: 401 }
        );
      }

      // Get admin details
      const admin_response = await AdminService.getAdminByUserId(
        decoded.payload?.userId
      );
      if (!admin_response.success || !admin_response.data) {
        return NextResponse.json(
          {
            success: false,
            message: admin_response.error || "User is not an admin",
          },
          { status: admin_response.statusCode || 403 }
        );
      }

      const admin = admin_response.data as AdminData;

      // Check if admin is active
      if (!admin.is_active) {
        return NextResponse.json(
          {
            success: false,
            message: "Admin account is deactivated",
          },
          { status: 403 }
        );
      }

      // Check role
      if (admin.role !== required_role) {
        return NextResponse.json(
          {
            success: false,
            message: `Access denied. Required role: ${required_role}`,
          },
          { status: 403 }
        );
      }

      // Add admin info to request
      const admin_req = req as AdminAuthRequest;
      admin_req.user_id = decoded.payload?.userId;
      admin_req.admin_id = admin._id.toString();
      admin_req.admin_role = admin.role;
      admin_req.permissions = admin.permissions;

      // Call the handler
      return await handler(admin_req);
    } catch (error) {
      console.error("Admin auth middleware error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Extract client information from request
 */
export function get_client_info(req: NextRequest) {
  const ip_address =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const user_agent = req.headers.get("user-agent") || "unknown";

  return { ip_address, user_agent };
}
