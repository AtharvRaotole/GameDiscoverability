/**
 * GameSoul Backend API
 * Main entry point
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { env } from "./config/env";
import { testConnection } from "./config/database";
import { redis } from "./config/redis";
import { initSentry } from "./middleware/sentry";
import discoveryRoutes from "./routes/discovery.routes";
import journeyRoutes from "./routes/journey.routes";
import libraryRoutes from "./routes/library.routes";
import searchHistoryRoutes from "./routes/search-history.routes";
import gameRoutes from "./routes/game.routes";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(env.PORT, 10);

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "connected",
    redis: redis ? "connected" : "not configured",
  });
});

// API Routes
app.get("/api", (_req, res) => {
  res.json({
    message: "GameSoul API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      discover: "/api/discover",
      games: "/api/games",
      emotions: "/api/emotions",
    },
  });
});

app.use("/api", discoveryRoutes);
app.use("/api/journeys", journeyRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/games", gameRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
async function startServer() {
  // Initialize Sentry
  initSentry();

  // Test database connection
  await testConnection();

  // Initialize Pinecone (optional, will fail gracefully if not configured)
  try {
    const { initializePinecone } = await import("./services/pinecone.service");
    await initializePinecone();
  } catch (error) {
    console.warn("⚠️  Pinecone not initialized (optional):", error);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 CORS enabled for: ${env.CORS_ORIGIN}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

