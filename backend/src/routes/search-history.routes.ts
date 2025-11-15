/**
 * Search History Routes
 */

import { Router } from "express";
import {
  save,
  getHistory,
  deleteEntry,
  clear,
} from "../controllers/search-history.controller";

const router = Router();

router.post("/", save);
router.get("/:userId", getHistory);
router.delete("/:userId/:searchId", deleteEntry);
router.delete("/:userId", clear);

export default router;

