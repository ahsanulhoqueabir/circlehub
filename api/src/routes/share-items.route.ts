import { Router } from "express";
import {
  createShareItemHandler,
  deleteShareItemHandler,
  getShareItemHandler,
  getShareItemsHandler,
  updateShareItemHandler,
  updateShareItemStatusHandler,
} from "../controllers/share-items.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

const shareItemsRouter = Router();

shareItemsRouter.get("/", asyncHandler(getShareItemsHandler));
shareItemsRouter.post("/", requireAuth, asyncHandler(createShareItemHandler));

shareItemsRouter.get("/:id", asyncHandler(getShareItemHandler));
shareItemsRouter.put("/:id", requireAuth, asyncHandler(updateShareItemHandler));
shareItemsRouter.patch(
  "/:id",
  requireAuth,
  asyncHandler(updateShareItemStatusHandler),
);
shareItemsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(deleteShareItemHandler),
);

export default shareItemsRouter;
