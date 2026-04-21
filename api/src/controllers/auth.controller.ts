import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  loginUser,
  refreshAuthToken,
  registerUser,
  getCurrentUserById,
} from "../services/auth.service";
import { sendSuccess } from "../utils/api-response";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/cookies";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { ApiError } from "../utils/api-error";

export const registerHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const result = await registerUser(parsed.data);

  res.cookie(
    "accessToken",
    result.tokens.accessToken,
    accessTokenCookieOptions,
  );
  res.cookie(
    "refreshToken",
    result.tokens.refreshToken,
    refreshTokenCookieOptions,
  );

  sendSuccess(
    res,
    {
      user: result.user,
      tokens: result.tokens,
    },
    "Registration successful",
    StatusCodes.CREATED,
  );
};

export const loginHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const result = await loginUser(parsed.data);

  res.cookie(
    "accessToken",
    result.tokens.accessToken,
    accessTokenCookieOptions,
  );
  res.cookie(
    "refreshToken",
    result.tokens.refreshToken,
    refreshTokenCookieOptions,
  );

  sendSuccess(
    res,
    {
      user: result.user,
      tokens: result.tokens,
    },
    "Login successful",
  );
};

export const refreshHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const refreshToken =
    (req.body.refreshToken as string | undefined) || req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is required");
  }

  const result = await refreshAuthToken(refreshToken);

  res.cookie(
    "accessToken",
    result.tokens.accessToken,
    accessTokenCookieOptions,
  );
  res.cookie(
    "refreshToken",
    result.tokens.refreshToken,
    refreshTokenCookieOptions,
  );

  sendSuccess(
    res,
    {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    },
    "Token refreshed",
  );
};

export const meHandler = async (req: Request, res: Response): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const user = await getCurrentUserById(req.user.userId);

  sendSuccess(res, { user }, "Current user fetched successfully");
};

export const logoutHandler = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  res.clearCookie("accessToken", accessTokenCookieOptions);
  res.clearCookie("refreshToken", refreshTokenCookieOptions);

  sendSuccess(res, null, "Logout successful");
};
