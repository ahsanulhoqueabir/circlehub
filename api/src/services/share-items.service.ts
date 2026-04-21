import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import ShareItem from "../models/share-item.model";
import {
  CreateShareItemInput,
  ShareItemQueryInput,
  UpdateShareItemInput,
  UpdateShareItemStatusInput,
} from "../validations/share-item.validation";
import { ApiError } from "../utils/api-error";

const getSortStage = (
  sort: ShareItemQueryInput["sort"],
): Record<string, 1 | -1> => {
  if (sort === "oldest") {
    return { createdAt: 1 };
  }

  if (sort === "most-viewed") {
    return { views: -1, createdAt: -1 };
  }

  if (sort === "price-asc") {
    return { price: 1, createdAt: -1 };
  }

  if (sort === "price-desc") {
    return { price: -1, createdAt: -1 };
  }

  return { createdAt: -1 };
};

const buildFilter = (query: ShareItemQueryInput): Record<string, unknown> => {
  const filter: Record<string, unknown> = {};

  if (query.category && query.category !== "all") {
    filter.category = query.category;
  }

  if (query.status) {
    filter.status = query.status;
  } else {
    filter.status = "available";
  }

  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }

  if (query.userId && mongoose.Types.ObjectId.isValid(query.userId)) {
    filter.userId = new mongoose.Types.ObjectId(query.userId);
  }

  if (query.offerType) {
    filter.offerType = query.offerType;
  }

  if (query.condition) {
    filter.condition = query.condition;
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

  return filter;
};

export const listShareItems = async (query: ShareItemQueryInput) => {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;
  const filter = buildFilter(query);
  const sort = getSortStage(query.sort);

  const [items, total] = await Promise.all([
    ShareItem.find(filter).sort(sort).skip(offset).limit(limit),
    ShareItem.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: Math.floor(offset / limit) + 1,
    limit,
    hasMore: offset + items.length < total,
  };
};

export const getShareItemById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item id");
  }

  const item = await ShareItem.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true },
  );

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Item not found");
  }

  return item;
};

export const createShareItem = async (
  payload: CreateShareItemInput,
  userId: string,
) => {
  // Validate price for sale items
  if (payload.offerType === "sale" && (!payload.price || payload.price <= 0)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Price is required and must be greater than 0 for sale items",
    );
  }

  const item = await ShareItem.create({
    ...payload,
    userId: new mongoose.Types.ObjectId(userId),
  });

  return item;
};

const getOwnedShareItem = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item id");
  }

  const item = await ShareItem.findById(id);

  if (!item) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Item not found");
  }

  if (String(item.userId) !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not own this item");
  }

  return item;
};

export const updateShareItem = async (
  id: string,
  payload: UpdateShareItemInput,
  userId: string,
) => {
  const item = await getOwnedShareItem(id, userId);

  // Validate price if offer type is being changed to sale
  if (payload.offerType === "sale" && (!payload.price || payload.price <= 0)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Price is required and must be greater than 0 for sale items",
    );
  }

  Object.assign(item, payload);
  await item.save();

  return item;
};

export const updateShareItemStatus = async (
  id: string,
  payload: UpdateShareItemStatusInput,
  userId: string,
) => {
  const item = await getOwnedShareItem(id, userId);

  item.status = payload.status;
  await item.save();

  return item;
};

export const deleteShareItem = async (id: string, userId: string) => {
  const item = await getOwnedShareItem(id, userId);
  await ShareItem.deleteOne({ _id: item._id });
};

export const getShareItemsStatistics = async (userId?: string) => {
  const filter: Record<string, unknown> = {};

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    filter.userId = new mongoose.Types.ObjectId(userId);
  }

  const [totalItems, availableItems, sharedItems, byOfferType, byCondition] =
    await Promise.all([
      ShareItem.countDocuments(filter),
      ShareItem.countDocuments({ ...filter, status: "available" }),
      ShareItem.countDocuments({ ...filter, status: "shared" }),
      ShareItem.aggregate([
        { $match: filter },
        { $group: { _id: "$offerType", count: { $sum: 1 } } },
      ]),
      ShareItem.aggregate([
        { $match: filter },
        { $group: { _id: "$condition", count: { $sum: 1 } } },
      ]),
    ]);

  const itemsByOfferType = byOfferType.reduce<Record<string, number>>(
    (acc, row) => {
      acc[String(row._id)] = Number(row.count);
      return acc;
    },
    {},
  );

  const itemsByCondition = byCondition.reduce<Record<string, number>>(
    (acc, row) => {
      acc[String(row._id)] = Number(row.count);
      return acc;
    },
    {},
  );

  return {
    totalItems,
    availableItems,
    sharedItems,
    itemsByOfferType,
    itemsByCondition,
  };
};
