import { Router } from "express";
import authRouter from "./auth.route";
import healthRouter from "./health.route";
import itemsRouter from "./items.route";
import userRouter from "./user.route";
import adminRouter from "./admin.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/items", itemsRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);

export default router;
