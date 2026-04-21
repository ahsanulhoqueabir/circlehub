import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model";
import LostItem from "../models/lost-item.model";
import FoundItem from "../models/found-item.model";
import ShareItem from "../models/share-item.model";
import FoundItemClaim from "../models/found-item-claim.model";
import { ApiError } from "../utils/api-error";
import {
  AdminUpdateUserInput,
  AdminChangeUserRoleInput,
  AdminQueryInput,
  AdminItemsQueryInput,
} from "../validations/admin.validation";

export const getDashboardStatistics = async () => {
  const [
    totalUsers,
    activeUsers,
    totalLostItems,
    activeLostItems,
    totalFoundItems,
    activeFoundItems,
    totalShareItems,
    activeShareItems,
    totalClaims,
    pendingClaims,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isVerified: true }),
    LostItem.countDocuments(),
    LostItem.countDocuments({ status: "active" }),
    FoundItem.countDocuments(),
    FoundItem.countDocuments({ status: "active" }),
    ShareItem.countDocuments(),
    ShareItem.countDocuments({ status: "available" }),
    FoundItemClaim.countDocuments(),
    FoundItemClaim.countDocuments({ status: "pending" }),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
    },
    items: {
      lost: { total: totalLostItems, active: activeLostItems },
      found: { total: totalFoundItems, active: activeFoundItems },
      share: { total: totalShareItems, active: activeShareItems },
    },
    claims: {
      total: totalClaims,
      pending: pendingClaims,
    },
  };
};

export const listUsers = async (query: AdminQueryInput) => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;

  const filter: Record<string, unknown> = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.isVerified !== undefined) {
    filter.isVerified = query.isVerified;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name: { name: 1 },
  };

  const sort = sortMap[query.sort ?? "newest"];

  const [users, total] = await Promise.all([
    User.find(filter).sort(sort).skip(offset).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + users.length < total,
  };
};

export const getUser = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user id");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

export const updateUser = async (
  userId: string,
  payload: AdminUpdateUserInput,
) => {
  const user = await getUser(userId);

  if (payload.name) {
    user.name = payload.name;
  }

  if (payload.phone !== undefined) {
    user.phone = payload.phone;
  }

  if (payload.isVerified !== undefined) {
    user.isVerified = payload.isVerified;
  }

  await user.save();

  return user;
};

export const changeUserRole = async (
  payload: AdminChangeUserRoleInput,
) => {
  const user = await getUser(payload.userId);

  user.role = payload.role;
  await user.save();

  return user;
};

export const deleteUser = async (userId: string) => {
  const user = await getUser(userId);

  await User.deleteOne({ _id: userId });

  return { message: "User deleted successfully" };
};

export const listItems = async (query: AdminItemsQueryInput) => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;

  const filter: Record<string, unknown> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.category) {
    filter.category = query.category;
  }

  let Model: typeof LostItem | typeof FoundItem | typeof ShareItem;
  switch (query.itemType) {
    case "lost":
      Model = LostItem;
      break;
    case "found":
      Model = FoundItem;
      break;
    case "share":
      Model = ShareItem;
      break;
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item type");
  }

  const [items, total] = await Promise.all([
    (Model as any).find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit),
    (Model as any).countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + items.length < total,
  };
};

export const getItem = async (
  itemType: "lost" | "found" | "share",
  itemId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item id");
  }

  let Model: typeof LostItem | typeof FoundItem | typeof ShareItem;
  switch (itemType) {
    case "lost":
      Model = LostItem;
      break;
    case "found":
      Model = FoundItem;
      break;
    case "share":
      Model = ShareItem;
      break;
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item type");
  }

  const item = await (Model as any).findById(itemId);

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Item not found");
  }

  return item;
};

export const deleteItem = async (
  itemType: "lost" | "found" | "share",
  itemId: string,
) => {
  await getItem(itemType, itemId);

  let Model: typeof LostItem | typeof FoundItem | typeof ShareItem;
  switch (itemType) {
    case "lost":
      Model = LostItem;
      break;
    case "found":
      Model = FoundItem;
      break;
    case "share":
      Model = ShareItem;
      break;
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item type");
  }

  await (Model as any).deleteOne({ _id: itemId });

  return { message: "Item deleted successfully" };
};

export const listClaims = async (query: AdminQueryInput) => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;

  const filter: Record<string, unknown> = {};

  if (query.role) {
    filter.status = query.role;
  }

  const [claims, total] = await Promise.all([
    FoundItemClaim.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("foundItemId")
      .populate("claimerId"),
    FoundItemClaim.countDocuments(filter),
  ]);

  return {
    claims,
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + claims.length < total,
  };
};

export const getClaim = async (claimId: string) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid claim id");
  }

  const claim = await FoundItemClaim.findById(claimId)
    .populate("foundItemId")
    .populate("claimerId");

  if (!claim) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Claim not found");
  }

  return claim;
};
