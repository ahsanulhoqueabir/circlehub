import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createFoundItem,
  deleteFoundItem,
  getFoundItemById,
  getFoundItemsStatistics,
  listFoundItems,
  resolveFoundItem,
  updateFoundItem,
} from "../services/found-items.service";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/api-response";
import {
  foundItemsQuerySchema,
  foundItemSchema,
  resolveFoundItemSchema,
  updateFoundItemSchema,
} from "../validations/found-item.validation";

const getParamId = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Item id is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const getFoundItemsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const parsed = foundItemsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  if (parsed.data.action === "statistics") {
    const stats = await getFoundItemsStatistics(parsed.data.userId);
    sendSuccess(res, stats, "Found item statistics fetched successfully");
    return;
  }

  const result = await listFoundItems(parsed.data);
  sendSuccess(res, result, "Found items fetched successfully");
};

export const getFoundItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const itemId = getParamId(req.params.id);
  const item = await getFoundItemById(itemId);
  sendSuccess(res, item, "Found item fetched successfully");
};

export const createFoundItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = foundItemSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const item = await createFoundItem(parsed.data, req.user.userId);
  sendSuccess(
    res,
    item,
    "Found item reported successfully",
    StatusCodes.CREATED,
  );
};

export const updateFoundItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = updateFoundItemSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const itemId = getParamId(req.params.id);
  const item = await updateFoundItem(itemId, parsed.data, req.user.userId);
  sendSuccess(res, item, "Found item updated successfully");
};

export const deleteFoundItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const itemId = getParamId(req.params.id);
  await deleteFoundItem(itemId, req.user.userId);
  sendSuccess(res, null, "Found item deleted successfully");
};

export const resolveFoundItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = resolveFoundItemSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid action");
  }

  const itemId = getParamId(req.params.id);
  const item = await resolveFoundItem(itemId, req.user.userId);
  sendSuccess(res, item, "Item marked as resolved");
};
