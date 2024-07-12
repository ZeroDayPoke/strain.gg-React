// ./server.ts

import app from "./app";
import db from "./config/database";
import { logger } from "./middleware";
import { Server } from "http";
import { Sequelize } from "sequelize";
import ENV from "./utils/loadEnv";

const PORT = ENV.PORT;

// Database connection
async function startServer(): Promise<void> {
  try {
    await db.authenticate();
    logger.info("Database connected...");

    if (ENV.NODE_ENV !== "production") {
      await db.sync();
      logger.info("Tables created...");
    }

    const server: Server = app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received. Shutting down gracefully.`);
      server.close(async () => {
        logger.info("Server closed");
        await (db as Sequelize).close();
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    logger.error("Unable to connect to the database:", err);
    process.exit(1);
  }
}

startServer();
