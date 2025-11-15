/**
 * Discovery Routes
 */

import { Router } from "express";
import { discoverGames, extractEmotions } from "../controllers/discovery.controller";

const router = Router();

router.post("/discover", discoverGames);
router.post("/emotions/extract", extractEmotions);

export default router;

