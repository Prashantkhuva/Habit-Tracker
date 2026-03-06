import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { startReminderJob } from "./jobs/reminder.jobs.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    startReminderJob();
  })
  .catch((err) => {
    console.log("MongoDB Connection error", err);
  });
