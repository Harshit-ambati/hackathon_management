import { Router } from "express";
import { createHackathon, deleteHackathon, getHackathon, listHackathons, updateHackathon } from "../controllers/hackathon.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { hackathonSchema, hackathonUpdateSchema } from "../utils/validators.js";

const router = Router();

router.get("/", listHackathons);
router.get("/:id", getHackathon);
router.post("/", protect, authorize("organizer", "admin"), validate(hackathonSchema), createHackathon);
router.put("/:id", protect, authorize("organizer", "admin"), validate(hackathonUpdateSchema), updateHackathon);
router.delete("/:id", protect, authorize("organizer", "admin"), deleteHackathon);

export default router;
