import dbConnect from "@/lib/mongodb";
import User from "@/models/users.m";
import type { ServiceResponse } from "@/types/auth.types";

export class UserService {
  /**
   * Get user by ID with role information
   */
  static async getUserById(userId: string): Promise<
    ServiceResponse<{
      id: string;
      email: string;
      name: string;
      role: "student" | "admin" | "moderator" | "support_staff";
      verified: boolean;
      is_active: boolean;
      is_banned: boolean;
    }>
  > {
    try {
      await dbConnect();

      const user = await User.findById(userId);

      if (!user) {
        return {
          success: false,
          error: "User not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified,
          is_active: user.is_active,
          is_banned: user.is_banned,
        },
        statusCode: 200,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Get user by ID error:", error);
      return {
        success: false,
        error: "Failed to fetch user",
        statusCode: 500,
      };
    }
  }

  /**
   * Update user role
   * Only admin can update roles
   */
  static async updateUserRole(
    userId: string,
    newRole: "student" | "admin" | "moderator" | "support_staff",
    adminUserId: string
  ): Promise<ServiceResponse<{ message: string }>> {
    try {
      await dbConnect();

      // Check if the admin has permission
      const adminUser = await User.findById(adminUserId);
      if (!adminUser || adminUser.role !== "admin") {
        return {
          success: false,
          error: "Only admins can update user roles",
          statusCode: 403,
        };
      }

      // Find the user to update
      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          error: "User not found",
          statusCode: 404,
        };
      }

      // Update the role
      user.role = newRole;
      await user.save();

      return {
        success: true,
        data: {
          message: `User role updated to ${newRole} successfully`,
        },
        statusCode: 200,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Update user role error:", error);
      return {
        success: false,
        error: "Failed to update user role",
        statusCode: 500,
      };
    }
  }

  /**
   * Get all users with pagination
   */
  static async getAllUsers(
    page: number = 1,
    limit: number = 10,
    role?: "student" | "admin" | "moderator" | "support_staff"
  ): Promise<
    ServiceResponse<{
      users: Array<{
        id: string;
        email: string;
        name: string;
        role: string;
        verified: boolean;
        is_active: boolean;
        is_banned: boolean;
        created_at: Date;
      }>;
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>
  > {
    try {
      await dbConnect();

      const query = role ? { role } : {};
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        User.find(query)
          .select("-password")
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(query),
      ]);

      return {
        success: true,
        data: {
          users: users.map((user) => ({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            verified: user.verified,
            is_active: user.is_active,
            is_banned: user.is_banned,
            created_at: user.created_at,
          })),
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        statusCode: 200,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Get all users error:", error);
      return {
        success: false,
        error: "Failed to fetch users",
        statusCode: 500,
      };
    }
  }
}

export default UserService;
