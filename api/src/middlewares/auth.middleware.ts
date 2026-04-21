import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../services/jwt.service";
import { isAccessTokenBlacklisted } from "../services/token-security.service";

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

  void (async () => {
    try {
      const payload = verifyAccessToken(token);
      const blacklisted = await isAccessTokenBlacklisted(payload.jti);

      if (blacklisted) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Token has been revoked");
      }

      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
        return;
      }

      next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired token"));
    }
  })();
};
