import { Router } from "express";
import {
  cancelRegistration,
  listHackathonRegistrations,
  listMyRegistrations,
  registerForHackathon,
  reviewRegistration,
} from "../controllers/registration.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registrationReviewSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);

router.get("/me", authorize("participant"), listMyRegistrations);
router.post("/hackathons/:hackathonId", authorize("participant"), registerForHackathon);
router.delete("/:id", authorize("participant"), cancelRegistration);
router.get("/hackathons/:hackathonId", authorize("organizer", "admin"), listHackathonRegistrations);
router.patch("/:id/review", authorize("organizer", "admin"), validate(registrationReviewSchema), reviewRegistration);

export default router;
