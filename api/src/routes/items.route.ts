import { Router } from "express";
import foundItemsRouter from "./found-items.route";
import lostItemsRouter from "./lost-items.route";

const itemsRouter = Router();

itemsRouter.use("/lost", lostItemsRouter);
itemsRouter.use("/found", foundItemsRouter);

export default itemsRouter;
