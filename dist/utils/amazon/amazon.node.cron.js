"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const amazon_check_new_products_1 = require("./amazon.check.new.products");
// Run every 6 hours
node_cron_1.default.schedule("0 */6 * * *", async () => {
    console.log("🔍 Running Amazon node-cron service...");
    try {
        // await amazonCheckOldProducts();
        await (0, amazon_check_new_products_1.amazonCheckNewProducts)();
        console.log("✅ Amazon node-cron service completed");
    }
    catch (error) {
        console.error("❌ Error running node-cron service:", error);
    }
});
// Run immediately
(async () => {
    console.log("🔍 Running Amazon node-cron service...");
    try {
        // await amazonCheckOldProducts();
        await (0, amazon_check_new_products_1.amazonCheckNewProducts)();
        console.log("✅ Amazon node-cron service completed");
    }
    catch (error) {
        console.error("❌ Error running node-cron service:", error);
    }
})();
