import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import "dotenv/config";

const { app } = await import("./app.js");
const { default: connectDB } = await import("./db/index.js");
const { startReminderJob } = await import("./jobs/reminder.jobs.js");

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
