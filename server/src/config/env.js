import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key] && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const clientOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hackathon_management",
  jwtSecret: process.env.JWT_SECRET || "development_only_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientOrigins,
};
