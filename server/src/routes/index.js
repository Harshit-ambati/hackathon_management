import { Router } from "express";
import authRoutes from "./auth.routes.js";
import hackathonRoutes from "./hackathon.routes.js";
import healthRoutes from "./health.routes.js";
import registrationRoutes from "./registration.routes.js";
import resultRoutes from "./result.routes.js";
import reviewRoutes from "./review.routes.js";
import submissionRoutes from "./submission.routes.js";
import teamRoutes from "./team.routes.js";

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/hackathons", hackathonRoutes);
router.use("/registrations", registrationRoutes);
router.use("/teams", teamRoutes);
router.use("/submissions", submissionRoutes);
router.use("/reviews", reviewRoutes);
router.use("/results", resultRoutes);

export default router;
