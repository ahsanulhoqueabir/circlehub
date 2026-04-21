import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export const connectDatabase = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI);
  logger.info("MongoDB connection established");
};
