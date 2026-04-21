import { Router } from "express";
import {
  createFoundItemHandler,
  deleteFoundItemHandler,
  getFoundItemHandler,
  getFoundItemsHandler,
  resolveFoundItemHandler,
  updateFoundItemHandler,
} from "../controllers/found-items.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

const foundItemsRouter = Router();

foundItemsRouter.get("/", asyncHandler(getFoundItemsHandler));
foundItemsRouter.post("/", requireAuth, asyncHandler(createFoundItemHandler));

foundItemsRouter.get("/:id", asyncHandler(getFoundItemHandler));
foundItemsRouter.put("/:id", requireAuth, asyncHandler(updateFoundItemHandler));
foundItemsRouter.delete(
  "/:id",
  requireAuth,
  asyncHandler(deleteFoundItemHandler),
);
foundItemsRouter.patch(
  "/:id",
  requireAuth,
  asyncHandler(resolveFoundItemHandler),
);

export default foundItemsRouter;
