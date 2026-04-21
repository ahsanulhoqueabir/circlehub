import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createLostItem,
  deleteLostItem,
  getLostItemById,
  getLostItemsStatistics,
  listLostItems,
  resolveLostItem,
  updateLostItem,
} from "../services/lost-items.service";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/api-response";
import {
  lostItemsQuerySchema,
  lostItemSchema,
  resolveLostItemSchema,
  updateLostItemSchema,
} from "../validations/lost-item.validation";

const getParamId = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Item id is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const getLostItemsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = lostItemsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  if (parsed.data.action === "statistics") {
    const stats = await getLostItemsStatistics(parsed.data.userId);
    sendSuccess(res, stats, "Lost item statistics fetched successfully");
    return;
  }

  const result = await listLostItems(parsed.data);
  sendSuccess(res, result, "Lost items fetched successfully");
};

export const getLostItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const itemId = getParamId(req.params.id);
  const item = await getLostItemById(itemId);
  sendSuccess(res, item, "Lost item fetched successfully");
};

export const createLostItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = lostItemSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const item = await createLostItem(parsed.data, req.user.userId);
  sendSuccess(
    res,
    item,
    "Lost item reported successfully",
    StatusCodes.CREATED,
  );
};

export const updateLostItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = updateLostItemSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const itemId = getParamId(req.params.id);
  const item = await updateLostItem(itemId, parsed.data, req.user.userId);
  sendSuccess(res, item, "Lost item updated successfully");
};

export const deleteLostItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const itemId = getParamId(req.params.id);
  await deleteLostItem(itemId, req.user.userId);
  sendSuccess(res, null, "Lost item deleted successfully");
};

export const resolveLostItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = resolveLostItemSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid action");
  }

  const itemId = getParamId(req.params.id);
  const item = await resolveLostItem(itemId, req.user.userId);
  sendSuccess(res, item, "Item marked as resolved");
};
