import { Router } from "express";
import {
  addMember,
  createTeam,
  deleteTeam,
  getTeam,
  leaveTeam,
  listHackathonTeams,
  listMyTeams,
  removeMember,
  transferLeadership,
  updateTeam,
} from "../controllers/team.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { teamCreateSchema, teamMemberSchema, teamUpdateSchema, transferLeadershipSchema } from "../utils/validators.js";

const router = Router();

router.use(protect);

router.post("/", authorize("participant"), validate(teamCreateSchema), createTeam);
router.get("/me", authorize("participant"), listMyTeams);
router.get("/hackathons/:hackathonId", authorize("organizer", "admin"), listHackathonTeams);
router.get("/:id", getTeam);
router.put("/:id", authorize("participant"), validate(teamUpdateSchema), updateTeam);
router.post("/:id/members", authorize("participant"), validate(teamMemberSchema), addMember);
router.delete("/:id/members/:userId", authorize("participant"), removeMember);
router.post("/:id/leave", authorize("participant"), leaveTeam);
router.patch("/:id/leadership", authorize("participant"), validate(transferLeadershipSchema), transferLeadership);
router.delete("/:id", authorize("participant"), deleteTeam);

export default router;
