/**
 * Journey Routes
 */

import { Router } from "express";
import {
  getCurated,
  getUser,
  getById,
  create,
  fork,
} from "../controllers/journey.controller";

const router = Router();

router.get("/curated", getCurated);
router.get("/user/:userId", getUser);
router.get("/:id", getById);
router.post("/", create);
router.post("/:id/fork", fork);

export default router;

