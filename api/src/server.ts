import app from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);
    });

    const shutdown = (signal: string): void => {
      logger.warn({ signal }, "Shutdown signal received");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.fatal({ err: error }, "Failed to start server");
    process.exit(1);
  }
};

void startServer();
