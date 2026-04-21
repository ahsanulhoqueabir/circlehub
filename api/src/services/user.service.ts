import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import {
  UpdateProfileInput,
  ChangePasswordInput,
} from "../validations/user.validation";
import { ApiError } from "../utils/api-error";

const SALT_ROUNDS = 10;

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

export const updateUserProfile = async (
  userId: string,
  payload: UpdateProfileInput,
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (payload.name) {
    user.name = payload.name;
  }

  if (payload.phone) {
    user.phone = payload.phone;
  }

  if (payload.avatar) {
    user.avatar = payload.avatar;
  }

  await user.save();

  return user;
};

export const changeUserPassword = async (
  userId: string,
  payload: ChangePasswordInput,
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (!user.password) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password reset required for this account",
    );
  }

  const passwordMatched = await bcrypt.compare(
    payload.currentPassword,
    user.password,
  );

  if (!passwordMatched) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Current password is incorrect",
    );
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, SALT_ROUNDS);
  user.password = hashedPassword;

  await user.save();

  return { message: "Password changed successfully" };
};

export const deleteUserAccount = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Optional: Archive related data before deletion
  // await Promise.all([
  //   LostItem.deleteMany({ userId }),
  //   FoundItem.deleteMany({ userId }),
  //   ShareItem.deleteMany({ userId }),
  // ]);

  await User.deleteOne({ _id: userId });

  return { message: "Account deleted successfully" };
};
