import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import LostItem from "../models/lost-item.model";
import {
  CreateLostItemInput,
  LostItemQueryInput,
  UpdateLostItemInput,
} from "../validations/lost-item.validation";
import { ApiError } from "../utils/api-error";

const getSortStage = (
  sort: LostItemQueryInput["sort"],
): Record<string, 1 | -1> => {
  if (sort === "oldest") {
    return { createdAt: 1 };
  }

  if (sort === "most-viewed") {
    return { views: -1, createdAt: -1 };
  }

  if (sort === "recently-updated") {
    return { updatedAt: -1 };
  }

  return { createdAt: -1 };
};

const buildFilter = (query: LostItemQueryInput): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (query.category && query.category !== "all") {
    filter.category = query.category;
  }

  if (query.status) {
    filter.status = query.status;
  } else {
    filter.status = "active";
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }

  if (query.userId && mongoose.Types.ObjectId.isValid(query.userId)) {
    filter.userId = new mongoose.Types.ObjectId(query.userId);
  }

  if (query.tags) {
    const tags = query.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tags.length) {
      filter.tags = { $in: tags };
    }
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.dateFrom || query.dateTo) {
    const dateRange: { $gte?: Date; $lte?: Date } = {};

    if (query.dateFrom) {
      dateRange.$gte = query.dateFrom;
    }

    if (query.dateTo) {
      dateRange.$lte = query.dateTo;
    }

    filter.dateLost = dateRange;
  }

  return filter;
};

export const listLostItems = async (query: LostItemQueryInput) => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;
  const filter = buildFilter(query);
  const sort = getSortStage(query.sort);

  const [items, total] = await Promise.all([
    LostItem.find(filter).sort(sort).skip(offset).limit(limit),
    LostItem.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + items.length < total,
  };
};

export const getLostItemById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item id");
  }

  const item = await LostItem.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true },
  );

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Item not found");
  }

  return item;
};

export const createLostItem = async (
  payload: CreateLostItemInput,
  userId: string,
) => {
  const item = await LostItem.create({
    ...payload,
    userId: new mongoose.Types.ObjectId(userId),
  });

  return item;
};

const getOwnedLostItem = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item id");
  }

  const item = await LostItem.findById(id);

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Item not found");
  }

  if (String(item.userId) !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not own this item");
  }

  return item;
};

export const updateLostItem = async (
  id: string,
  payload: UpdateLostItemInput,
  userId: string,
) => {
  const item = await getOwnedLostItem(id, userId);

  Object.assign(item, payload);
  await item.save();

  return item;
};

export const deleteLostItem = async (id: string, userId: string) => {
  const item = await getOwnedLostItem(id, userId);
  await LostItem.deleteOne({ _id: item._id });
};

export const resolveLostItem = async (id: string, userId: string) => {
  const item = await getOwnedLostItem(id, userId);
  item.status = "resolved";
  await item.save();
  return item;
};

export const getLostItemsStatistics = async (userId?: string) => {
  const filter: Record<string, unknown> = {};

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    filter.userId = new mongoose.Types.ObjectId(userId);
  }

  const [totalItems, activeItems, resolvedItems, categoryStats, recentItems] =
    await Promise.all([
      LostItem.countDocuments(filter),
      LostItem.countDocuments({ ...filter, status: "active" }),
      LostItem.countDocuments({ ...filter, status: "resolved" }),
      LostItem.aggregate([
        { $match: filter },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
      LostItem.countDocuments({
        ...filter,
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

  const itemsByCategory = categoryStats.reduce<Record<string, number>>(
    (acc, row) => {
      acc[String(row._id)] = Number(row.count);
      return acc;
    },
    {},
  );

  return {
    totalItems,
    activeItems,
    resolvedItems,
    itemsByCategory,
    recentItems,
  };
};
