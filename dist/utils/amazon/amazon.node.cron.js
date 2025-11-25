"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const amazon_check_updates_1 = require("./amazon.check.updates");
// Run every 6 hours
node_cron_1.default.schedule("0 */6 * * *", async () => {
    console.log("🔍 Running automatic Amazon checkUpdates...");
    try {
        await (0, amazon_check_updates_1.amazonCheckUpdates)();
        console.log("✅ Amazon checkUpdates completed");
    }
    catch (error) {
        console.error("❌ Error running checkUpdates:", error);
    }
});
// Run immediately
(async () => {
    console.log("🔍 Running automatic Amazon checkUpdates...");
    try {
        await (0, amazon_check_updates_1.amazonCheckUpdates)();
        console.log("✅ Amazon checkUpdates completed");
    }
    catch (error) {
        console.error("❌ Error running checkUpdates:", error);
    }
})();
