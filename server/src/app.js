import express from "express";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "hackathon-management-api" });
});

export default app;
