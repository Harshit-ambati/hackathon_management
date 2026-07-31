import { Router } from "express";
import { assignJudge, listAssignedReviews, listHackathonReviews, submitReview } from "../controllers/review.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { judgeAssignmentSchema, reviewSubmitSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);

router.post("/assign", authorize("organizer", "admin"), validate(judgeAssignmentSchema), assignJudge);
router.get("/assigned", authorize("judge"), listAssignedReviews);
router.patch("/:id", authorize("judge"), validate(reviewSubmitSchema), submitReview);
router.get("/hackathons/:hackathonId", authorize("organizer", "admin"), listHackathonReviews);

export default router;
