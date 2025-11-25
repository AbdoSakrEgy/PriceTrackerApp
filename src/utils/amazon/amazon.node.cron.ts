import cron from "node-cron";
import { amazonCheckOldProducts } from "./amazon.check.old.products";
import { amazonCheckNewProducts } from "./amazon.check.new.products";

// Run every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("🔍 Running Amazon node-cron service...");
  try {
    // await amazonCheckOldProducts();
    await amazonCheckNewProducts();
    console.log("✅ Amazon node-cron service completed");
  } catch (error) {
    console.error("❌ Error running node-cron service:", error);
  }
});

// Run immediately
(async () => {
  console.log("🔍 Running Amazon node-cron service...");
  try {
    // await amazonCheckOldProducts();
    await amazonCheckNewProducts();
    console.log("✅ Amazon node-cron service completed");
  } catch (error) {
    console.error("❌ Error running node-cron service:", error);
  }
})();
