import { Router } from "express";
import {
  getProfileHandler,
  updateProfileHandler,
  changePasswordHandler,
  deleteAccountHandler,
} from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

const userRouter = Router();

// All user routes require authentication
userRouter.use(requireAuth);

userRouter.get("/profile", asyncHandler(getProfileHandler));
userRouter.put("/profile", asyncHandler(updateProfileHandler));
userRouter.put("/password", asyncHandler(changePasswordHandler));
userRouter.delete("/delete", asyncHandler(deleteAccountHandler));

export default userRouter;
