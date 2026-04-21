import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  getDashboardStatistics,
  listUsers,
  getUser,
  updateUser,
  changeUserRole,
  deleteUser,
  listItems,
  getItem,
  deleteItem,
  listClaims,
  getClaim,
} from "../services/admin.service";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/api-response";
import {
  adminQuerySchema,
  adminUpdateUserSchema,
  adminChangeUserRoleSchema,
  adminItemsQuerySchema,
} from "../validations/admin.validation";

const checkAdminRole = (role?: string) => {
  if (role !== "admin") {
    throw new ApiError(StatusCodes.FORBIDDEN, "Admin access required");
  }
};

export const getDashboardHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const stats = await getDashboardStatistics();
  sendSuccess(res, stats, "Dashboard statistics fetched successfully");
};

export const listUsersHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const parsed = adminQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const result = await listUsers(parsed.data);
  sendSuccess(res, result, "Users fetched successfully");
};

export const getUserHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const user = await getUser(userId);
  sendSuccess(res, user, "User fetched successfully");
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const parsed = adminUpdateUserSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const user = await updateUser(userId, parsed.data);
  sendSuccess(res, user, "User updated successfully");
};

export const changeUserRoleHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const parsed = adminChangeUserRoleSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const user = await changeUserRole(parsed.data);
  sendSuccess(res, user, "User role updated successfully");
};

export const deleteUserHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await deleteUser(userId);
  sendSuccess(res, result, "User deleted successfully");
};

export const listItemsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const parsed = adminItemsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const result = await listItems(parsed.data);
  sendSuccess(res, result, "Items fetched successfully");
};

export const getItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const itemType = (Array.isArray(req.params.itemType) ? req.params.itemType[0] : req.params.itemType) as "lost" | "found" | "share";
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const item = await getItem(itemType, itemId);
  sendSuccess(res, item, "Item fetched successfully");
};

export const deleteItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const itemType = (Array.isArray(req.params.itemType) ? req.params.itemType[0] : req.params.itemType) as "lost" | "found" | "share";
  const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const result = await deleteItem(itemType, itemId);
  sendSuccess(res, result, "Item deleted successfully");
};

export const listClaimsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const parsed = adminQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const result = await listClaims(parsed.data);
  sendSuccess(res, result, "Claims fetched successfully");
};

export const getClaimHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  checkAdminRole(req.user?.role);

  const claimId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const claim = await getClaim(claimId);
  sendSuccess(res, claim, "Claim fetched successfully");
};
