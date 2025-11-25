import cron from "node-cron";
import { amazonCheckUpdates } from "./amazon.check.updates";

// Run every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("🔍 Running automatic Amazon checkUpdates...");
  try {
    await amazonCheckUpdates();
    console.log("✅ Amazon checkUpdates completed");
  } catch (error) {
    console.error("❌ Error running checkUpdates:", error);
  }
});

// Run immediately
(async () => {
  console.log("🔍 Running automatic Amazon checkUpdates...");
  try {
    await amazonCheckUpdates();
    console.log("✅ Amazon checkUpdates completed");
  } catch (error) {
    console.error("❌ Error running checkUpdates:", error);
  }
})();
