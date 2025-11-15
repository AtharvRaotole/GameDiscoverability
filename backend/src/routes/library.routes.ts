/**
 * Library Routes
 */

import { Router } from "express";
import {
  getLibrary,
  addGame,
  updateStatus,
  removeGame,
  getStats,
  getTimeline,
} from "../controllers/library.controller";

const router = Router();

router.get("/:userId", getLibrary);
router.get("/:userId/stats", getStats);
router.get("/:userId/timeline", getTimeline);
router.post("/", addGame);
router.patch("/:userId/:gameId", updateStatus);
router.delete("/:userId/:gameId", removeGame);

export default router;

