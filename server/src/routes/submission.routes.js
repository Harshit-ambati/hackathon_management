import { Router } from "express";
import {
  createSubmission,
  getSubmission,
  listHackathonSubmissions,
  listMySubmissions,
  updateSubmission,
  updateSubmissionStatus,
} from "../controllers/submission.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { submissionSchema, submissionStatusSchema, submissionUpdateSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);

router.post("/", authorize("participant"), validate(submissionSchema), createSubmission);
router.get("/me", authorize("participant"), listMySubmissions);
router.get("/hackathons/:hackathonId", authorize("organizer", "admin"), listHackathonSubmissions);
router.get("/:id", getSubmission);
router.put("/:id", authorize("participant"), validate(submissionUpdateSchema), updateSubmission);
router.patch("/:id/status", authorize("organizer", "admin"), validate(submissionStatusSchema), updateSubmissionStatus);

export default router;
