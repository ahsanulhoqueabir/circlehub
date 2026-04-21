import { Router } from "express";
import foundItemsRouter from "./found-items.route";
import lostItemsRouter from "./lost-items.route";
import shareItemsRouter from "./share-items.route";
import claimsRouter from "./found-item-claims.route";

const itemsRouter = Router();

itemsRouter.use("/lost", lostItemsRouter);
itemsRouter.use("/found", foundItemsRouter);
itemsRouter.use("/share", shareItemsRouter);
itemsRouter.use("/claims", claimsRouter);

export default itemsRouter;
