/**
 * Game Routes
 */

import { Router } from "express";
import {
  getAllGames,
  getGame,
  getSimilar,
  importGame,
  batchImport,
} from "../controllers/game.controller";

const router = Router();

router.get("/", getAllGames);
router.get("/:id", getGame);
router.get("/:id/similar", getSimilar);
router.post("/import", importGame);
router.post("/import/batch", batchImport);

export default router;

