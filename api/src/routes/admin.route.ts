import { Router } from "express";
import {
  getDashboardHandler,
  listUsersHandler,
  getUserHandler,
  updateUserHandler,
  changeUserRoleHandler,
  deleteUserHandler,
  listItemsHandler,
  getItemHandler,
  deleteItemHandler,
  listClaimsHandler,
  getClaimHandler,
} from "../controllers/admin.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

const adminRouter = Router();

// All admin routes require authentication
adminRouter.use(requireAuth);

// Dashboard
adminRouter.get("/dashboard", asyncHandler(getDashboardHandler));

// Users Management
adminRouter.get("/users", asyncHandler(listUsersHandler));
adminRouter.get("/users/:id", asyncHandler(getUserHandler));
adminRouter.put("/users/:id", asyncHandler(updateUserHandler));
adminRouter.put("/users/role/change", asyncHandler(changeUserRoleHandler));
adminRouter.delete("/users/:id", asyncHandler(deleteUserHandler));

// Items Management (Generic)
adminRouter.get("/items", asyncHandler(listItemsHandler));
adminRouter.get("/items/:itemType/:id", asyncHandler(getItemHandler));
adminRouter.delete("/items/:itemType/:id", asyncHandler(deleteItemHandler));

// Claims Management
adminRouter.get("/claims", asyncHandler(listClaimsHandler));
adminRouter.get("/claims/:id", asyncHandler(getClaimHandler));

export default adminRouter;
