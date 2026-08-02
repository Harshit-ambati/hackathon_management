import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./env.js";

// Ensure Node uses public DNS for SRV queries on systems where local ISP/router DNS fails SRV lookup
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if setting DNS servers fails
}

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.warn("Primary MongoDB connection failed:", error.message);
    console.log("Starting in-memory MongoDB fallback server...");
    try {
      await mongoose.disconnect();
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log("Connected to in-memory MongoDB at", mongoUri);

      console.log("Seeding initial sample data into in-memory database...");
      const { createSampleData } = await import("../scripts/seedSampleData.js");
      await createSampleData();
      console.log("Sample data seeded successfully.");
    } catch (fallbackError) {
      console.error("Failed to start in-memory MongoDB fallback:", fallbackError.message);
      process.exit(1);
    }
  }
}
