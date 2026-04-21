import { Router } from "express";
import {
  loginHandler,
  logoutAllHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler";

const authRouter = Router();

authRouter.post("/register", asyncHandler(registerHandler));
authRouter.post("/login", asyncHandler(loginHandler));
authRouter.post("/refresh", asyncHandler(refreshHandler));
authRouter.get("/me", requireAuth, asyncHandler(meHandler));
authRouter.post("/logout", asyncHandler(logoutHandler));
authRouter.post("/logout-all", requireAuth, asyncHandler(logoutAllHandler));

export default authRouter;
