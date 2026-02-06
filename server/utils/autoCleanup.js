// utils/autoCleanup.js
import cron from "node-cron";
import { deleteExpiredAvailability } from "../controllers/cleanupController.js";

// Run every 1 minutes
cron.schedule("*/1 * * * *", () => {
  console.log("🧹 Running auto cleanup...");
  deleteExpiredAvailability(
    {}, // req placeholder
    { json: (msg) => console.log(msg) } // res placeholder
  );
});
