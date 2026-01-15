import { withAuth } from "@/middleware/with-auth";
import { JwtPayload } from "@/types/jwt.types";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/models/users.m";
import { NextRequest, NextResponse } from "next/server";

// GET current user profile
export const GET = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    await dbConnect();

    const userProfile = await UserModel.findById(user.userId).select(
      "-password"
    );

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});

// PUT update user profile
export const PUT = withAuth(async (req: NextRequest, user: JwtPayload) => {
  try {
    const { name, university, studentId, phone } = await req.json();
    await dbConnect();

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;
    if (university !== undefined) updateData.university = university;
    if (studentId !== undefined) updateData.student_id = studentId;
    if (phone !== undefined) updateData.phone = phone;

    const updatedUser = await UserModel.findByIdAndUpdate(
      user.userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar_url,
        university: updatedUser.university,
        studentId: updatedUser.student_id,
        phone: updatedUser.phone,
        verified: updatedUser.verified,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
