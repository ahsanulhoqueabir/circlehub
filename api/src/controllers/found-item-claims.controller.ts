import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createFoundItemClaim,
  deleteClaim,
  getClaimsByFoundItemId,
  getClaimsByUserId,
  getReceivedClaims,
  updateClaimStatus,
} from "../services/found-item-claims.service";
import { ApiError } from "../utils/api-error";
import { sendSuccess } from "../utils/api-response";
import {
  createClaimSchema,
  updateClaimStatusSchema,
} from "../validations/found-item-claim.validation";

const getParamId = (id: string | string[] | undefined): string => {
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Id is required");
  }

  return Array.isArray(id) ? id[0] : id;
};

export const createClaimHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = createClaimSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const claim = await createFoundItemClaim(parsed.data, req.user.userId);
  sendSuccess(res, claim, "Claim created successfully", StatusCodes.CREATED);
};

export const getClaimsByItemHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const itemId = getParamId(req.params.itemId);
  const claims = await getClaimsByFoundItemId(itemId, req.user.userId);
  sendSuccess(res, claims, "Claims fetched successfully");
};

export const getMyClaimsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const claims = await getClaimsByUserId(req.user.userId);
  sendSuccess(res, claims, "Your claims fetched successfully");
};

export const getReceivedClaimsHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const claims = await getReceivedClaims(req.user.userId);
  sendSuccess(res, claims, "Received claims fetched successfully");
};

export const updateClaimStatusHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const parsed = updateClaimStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      parsed.error.issues[0]?.message || "Validation Error",
    );
  }

  const claimId = getParamId(req.params.claimId);
  const claim = await updateClaimStatus(claimId, parsed.data, req.user.userId);
  sendSuccess(res, claim, "Claim status updated successfully");
};

export const deleteClaimHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user?.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }

  const claimId = getParamId(req.params.claimId);
  await deleteClaim(claimId, req.user.userId);
  sendSuccess(res, null, "Claim deleted successfully");
};
