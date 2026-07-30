import { Router } from "express";
import authRoutes from "./auth.routes.js";
import hackathonRoutes from "./hackathon.routes.js";
import healthRoutes from "./health.routes.js";
import registrationRoutes from "./registration.routes.js";

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/hackathons", hackathonRoutes);
router.use("/registrations", registrationRoutes);

export default router;
