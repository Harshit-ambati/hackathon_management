import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`API server running on port ${env.port}`);
  });
}

startServer();
