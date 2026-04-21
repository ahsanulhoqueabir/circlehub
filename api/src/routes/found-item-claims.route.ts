import { Router } from "express";
import {
  createClaimHandler,
  deleteClaimHandler,
  getClaimsByItemHandler,
  getMyClaimsHandler,
  getReceivedClaimsHandler,
  updateClaimStatusHandler,
} from "../controllers/found-item-claims.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

const claimsRouter = Router();

// Create a new claim
claimsRouter.post("/", requireAuth, asyncHandler(createClaimHandler));

// Get all claims for a found item (owner only)
claimsRouter.get(
  "/item/:itemId",
  requireAuth,
  asyncHandler(getClaimsByItemHandler),
);

// Get all claims made by current user
claimsRouter.get("/my-claims", requireAuth, asyncHandler(getMyClaimsHandler));

// Get all claims received for user's found items
claimsRouter.get(
  "/received",
  requireAuth,
  asyncHandler(getReceivedClaimsHandler),
);

// Update claim status
claimsRouter.patch(
  "/:claimId",
  requireAuth,
  asyncHandler(updateClaimStatusHandler),
);

// Delete a claim
claimsRouter.delete("/:claimId", requireAuth, asyncHandler(deleteClaimHandler));

export default claimsRouter;
