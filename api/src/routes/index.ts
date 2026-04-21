import { Router } from "express";
import authRouter from "./auth.route";
import healthRouter from "./health.route";
import itemsRouter from "./items.route";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/items", itemsRouter);

export default router;
