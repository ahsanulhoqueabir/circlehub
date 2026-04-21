import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import FoundItemClaim from "../models/found-item-claim.model";
import FoundItem from "../models/found-item.model";
import {
  CreateClaimInput,
  UpdateClaimStatusInput,
  ClaimQueryInput,
} from "../validations/found-item-claim.validation";
import { ApiError } from "../utils/api-error";

export const createFoundItemClaim = async (
  payload: CreateClaimInput,
  userId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(payload.foundItemId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid found item id");
  }

  // Check if user already claimed this item
  const existingClaim = await FoundItemClaim.findOne({
    foundItemId: new mongoose.Types.ObjectId(payload.foundItemId),
    claimerId: new mongoose.Types.ObjectId(userId),
  });

  if (existingClaim) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "You have already claimed this item",
    );
  }

  // Check if item exists and is available
  const foundItem = await FoundItem.findById(payload.foundItemId);

  if (!foundItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Found item not found");
  }

  if (foundItem.status !== "active") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "This item is no longer available for claiming",
    );
  }

  // User cannot claim their own item
  if (String(foundItem.userId) === userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You cannot claim your own item");
  }

  const claim = await FoundItemClaim.create({
    foundItemId: new mongoose.Types.ObjectId(payload.foundItemId),
    claimerId: new mongoose.Types.ObjectId(userId),
    message: payload.message,
    contactInfo: payload.contactInfo,
  });

  return claim;
};

export const getClaimsByFoundItemId = async (
  itemId: string,
  userId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid item id");
  }

  // Verify user owns this found item
  const foundItem = await FoundItem.findById(itemId);

  if (!foundItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Found item not found");
  }

  if (String(foundItem.userId) !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not own this found item");
  }

  const claims = await FoundItemClaim.find({
    foundItemId: new mongoose.Types.ObjectId(itemId),
  })
    .sort({ createdAt: -1 })
    .lean();

  return claims;
};

export const getClaimsByUserId = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user id");
  }

  const claims = await FoundItemClaim.find({
    claimerId: new mongoose.Types.ObjectId(userId),
  })
    .populate("foundItemId")
    .sort({ createdAt: -1 })
    .lean();

  return claims;
};

export const updateClaimStatus = async (
  claimId: string,
  payload: UpdateClaimStatusInput,
  userId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid claim id");
  }

  const claim = await FoundItemClaim.findById(claimId);

  if (!claim) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Claim not found");
  }

  // Verify user owns the found item
  const foundItem = await FoundItem.findById(claim.foundItemId);

  if (!foundItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Found item not found");
  }

  if (String(foundItem.userId) !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You do not own this found item");
  }

  claim.status = payload.status;

  // If approving, update found item status to resolved
  if (payload.status === "approved") {
    foundItem.status = "resolved";
    await foundItem.save();

    // Reject all other pending claims
    await FoundItemClaim.updateMany(
      {
        foundItemId: claim.foundItemId,
        _id: { $ne: claim._id },
        status: "pending",
      },
      { status: "rejected" },
    );
  }

  await claim.save();

  return claim;
};

export const deleteClaim = async (claimId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid claim id");
  }

  const claim = await FoundItemClaim.findById(claimId);

  if (!claim) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Claim not found");
  }

  // User can only delete their own claim
  if (String(claim.claimerId) !== userId) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You can only delete your own claims",
    );
  }

  // Can only delete pending claims
  if (claim.status !== "pending") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Can only delete pending claims",
    );
  }

  await FoundItemClaim.deleteOne({ _id: claim._id });
};

export const getReceivedClaims = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user id");
  }

  // Find all found items by this user
  const foundItems = await FoundItem.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).select("_id");

  const foundItemIds = foundItems.map((item) => item._id);

  // Get all claims for those items
  const claims = await FoundItemClaim.find({
    foundItemId: { $in: foundItemIds },
  })
    .populate("foundItemId")
    .populate("claimerId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return claims;
};
