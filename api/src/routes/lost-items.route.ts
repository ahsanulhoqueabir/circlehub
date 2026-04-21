import { Router } from "express";
import {
  createLostItemHandler,
  deleteLostItemHandler,
  getLostItemHandler,
  getLostItemsHandler,
  resolveLostItemHandler,
  updateLostItemHandler,
} from "../controllers/lost-items.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

const lostItemsRouter = Router();

lostItemsRouter.get("/", asyncHandler(getLostItemsHandler));
lostItemsRouter.post("/", requireAuth, asyncHandler(createLostItemHandler));

lostItemsRouter.get("/:id", asyncHandler(getLostItemHandler));
lostItemsRouter.put("/:id", requireAuth, asyncHandler(updateLostItemHandler));
lostItemsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(deleteLostItemHandler),
);
lostItemsRouter.patch(
  "/:id",
  requireAuth,
  asyncHandler(resolveLostItemHandler),
);

export default lostItemsRouter;
