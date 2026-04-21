import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  loginUser,
  refreshAuthToken,
  registerUser,
  getCurrentUserById,
} from "../services/auth.service";
import { sendSuccess } from "../utils/api-response";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { ApiError } from "../utils/api-error";

const setAuthHeaders = (
  res: Response,
  accessToken: string,
  refreshToken: string,
): void => {
  res.setHeader("Authorization", `Bearer ${accessToken}`);
  res.setHeader("x-access-token", accessToken);
  res.setHeader("x-refresh-token", refreshToken);
};

const extractRefreshToken = (req: Request): string | undefined => {
  const refreshHeader = req.headers["x-refresh-token"];

  if (typeof refreshHeader === "string" && refreshHeader.trim().length > 0) {
    return refreshHeader.trim();
  }

  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    return token.length > 0 ? token : undefined;
  }

  return undefined;
};

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
  setAuthHeaders(res, result.tokens.accessToken, result.tokens.refreshToken);

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
  setAuthHeaders(res, result.tokens.accessToken, result.tokens.refreshToken);

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
  const refreshToken = extractRefreshToken(req);

  if (!refreshToken) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Refresh token is required in x-refresh-token or Authorization header",
    );
  }

  const result = await refreshAuthToken(refreshToken);
  setAuthHeaders(res, result.tokens.accessToken, result.tokens.refreshToken);

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
  res.setHeader("Authorization", "");
  res.setHeader("x-access-token", "");
  res.setHeader("x-refresh-token", "");

  sendSuccess(res, null, "Logout successful");
};
