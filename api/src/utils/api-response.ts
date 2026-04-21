import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Operation successful",
  statusCode = 200,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
