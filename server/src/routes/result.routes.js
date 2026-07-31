import { Router } from "express";
import { getLeaderboard, publishResults } from "../controllers/result.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/hackathons/:hackathonId/leaderboard", getLeaderboard);
router.post("/hackathons/:hackathonId/publish", protect, authorize("organizer", "admin"), publishResults);

export default router;
