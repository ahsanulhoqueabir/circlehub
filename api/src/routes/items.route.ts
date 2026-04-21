import { Router } from "express";
import lostItemsRouter from "./lost-items.route";

const itemsRouter = Router();

itemsRouter.use("/lost", lostItemsRouter);

export default itemsRouter;
