import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";
import { env } from "../config/env";
import { logger } from "../config/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  void next;
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError
    ? err.statusCode
    : StatusCodes.INTERNAL_SERVER_ERROR;
  const message = isApiError ? err.message : "Internal server error";

  if (statusCode >= 500) {
    logger.error({ err }, "Unhandled server error");
  } else {
    logger.warn({ err }, "Request error");
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: isApiError
      ? err.message
      : env.NODE_ENV === "production"
        ? "Internal error"
        : err.message,
  });
};
