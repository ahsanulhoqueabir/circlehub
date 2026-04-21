import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount,
} from "../services/user.service";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/api-response";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/user.validation";

export const getProfileHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const user = await getUserProfile(req.user.userId);
  sendSuccess(res, user, "Profile fetched successfully");
};

export const updateProfileHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = updateProfileSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const user = await updateUserProfile(req.user.userId, parsed.data);
  sendSuccess(res, user, "Profile updated successfully");
};

export const changePasswordHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = changePasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const result = await changeUserPassword(req.user.userId, parsed.data);
  sendSuccess(res, result, "Password changed successfully");
};

export const deleteAccountHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const result = await deleteUserAccount(req.user.userId);
  sendSuccess(res, result, "Account deleted successfully");
};
