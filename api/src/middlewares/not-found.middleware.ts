import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/api-error";

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new ApiError(StatusCodes.NOT_FOUND, "Route not found"));
};
