import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createShareItem,
  deleteShareItem,
  getShareItemById,
  getShareItemsStatistics,
  listShareItems,
  updateShareItem,
  updateShareItemStatus,
} from "../services/share-items.service";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/api-response";
import {
  shareItemsQuerySchema,
  shareItemSchema,
  updateShareItemSchema,
  updateShareItemStatusSchema,
} from "../validations/share-item.validation";

const getParamId = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Item id is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const getShareItemsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = shareItemsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  if (parsed.data.action === "statistics") {
    const stats = await getShareItemsStatistics(parsed.data.userId);
    sendSuccess(res, stats, "Share item statistics fetched successfully");
    return;
  }

  const result = await listShareItems(parsed.data);
  sendSuccess(res, result, "Share items fetched successfully");
};

export const getShareItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const itemId = getParamId(req.params.id);
  const item = await getShareItemById(itemId);
  sendSuccess(res, item, "Share item fetched successfully");
};

export const createShareItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = shareItemSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const item = await createShareItem(parsed.data, req.user.userId);
  sendSuccess(
    res,
    item,
    "Share item created successfully",
    StatusCodes.CREATED,
  );
};

export const updateShareItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = updateShareItemSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const itemId = getParamId(req.params.id);
  const item = await updateShareItem(itemId, parsed.data, req.user.userId);
  sendSuccess(res, item, "Share item updated successfully");
};

export const updateShareItemStatusHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = updateShareItemStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const itemId = getParamId(req.params.id);
  const item = await updateShareItemStatus(
    itemId,
    parsed.data,
    req.user.userId,
  );
  sendSuccess(res, item, "Share item status updated successfully");
};

export const deleteShareItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const itemId = getParamId(req.params.id);
  await deleteShareItem(itemId, req.user.userId);
  sendSuccess(res, null, "Share item deleted successfully");
};
