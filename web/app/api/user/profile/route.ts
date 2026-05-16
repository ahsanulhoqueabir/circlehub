import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/models/users.m";
import UserService from "@/services/user.services";
import { NextRequest, NextResponse } from "next/server";
import { handleOptions, corsResponse } from "@/lib/cors";

export const OPTIONS = handleOptions;

// GET current user profile
export const GET = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    await dbConnect();

    const userProfile = await UserModel.findById(user.userId).select(
      "-password",
    );

    if (!userProfile) {
      return corsResponse({ error: "User not found" }, { status: 404 });
    }

    return corsResponse({
      user: {
        id: userProfile._id.toString(),
        email: userProfile.email,
        name: userProfile.name,
        avatar: userProfile.avatar_url,
        university: userProfile.university,
        studentId: userProfile.student_id,
        phone: userProfile.phone,
        verified: userProfile.verified,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return corsResponse(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

// PUT update user profile
export const PUT = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    const { name, university, studentId, phone } = await req.json();

    const result = await UserService.updateProfile(user.userId, {
      name,
      university,
      studentId,
      phone,
    });

    if (!result.success) {
      return corsResponse(
        { error: result.error },
        { status: result.statusCode }
      );
    }

    return corsResponse(result.data, { status: result.statusCode });
  } catch (error) {
    console.error("Update user error:", error);
    return corsResponse(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
