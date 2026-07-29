import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "hackathon-management-api",
    timestamp: new Date().toISOString(),
  });
});

export default router;
