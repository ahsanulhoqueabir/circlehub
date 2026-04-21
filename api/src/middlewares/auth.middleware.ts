import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../services/jwt.service";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : undefined;
  const token = bearerToken;

  if (!token) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "No access token provided"));
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token"));
  }
};
