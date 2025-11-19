"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const product_model_1 = require("../../modules/product/product.model");
const scraper_1 = require("../scraper");
const send_email_1 = require("../../utils/sendEmail/send.email");
const notification_1 = require("../../utils/sendEmail/notification");
const user_repo_1 = require("../../modules/user/user.repo");
const getAveragePrice = (priceList) => {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    return sumOfPrices / priceList.length;
};
const getHighestPrice = (priceList) => {
    let highestPrice = priceList[0]?.price || 0;
    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price > highestPrice) {
            highestPrice = priceList[i].price;
        }
    }
    return highestPrice;
};
const getLowestPrice = (priceList) => {
    let lowestPrice = priceList[0]?.price || Infinity;
    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i].price < lowestPrice) {
            lowestPrice = priceList[i].price;
        }
    }
    return lowestPrice;
};
const startCronJobs = () => {
    // Schedule a task to run every hour. You can change this schedule.
    // See https://www.npmjs.com/package/node-cron for more examples.
    node_cron_1.default.schedule("0 * * * *", async () => {
        console.log("Running cron job to check product prices...");
        try {
            const products = await product_model_1.ProductModel.find({});
            if (!products || products.length === 0) {
                console.log("No products to check.");
                return;
            }
            const userRepo = new user_repo_1.UserRepo();
            for (const product of products) {
                const scrapedProduct = await (0, scraper_1.scrapeAmazonProduct)(product.url);
                if (!scrapedProduct)
                    continue;
                const updatedPriceHistory = [
                    ...product.priceHistory,
                    { price: scrapedProduct.currentPrice },
                ];
                product.priceHistory = updatedPriceHistory;
                product.lowestPrice = getLowestPrice(updatedPriceHistory);
                product.highestPrice = getHighestPrice(updatedPriceHistory);
                product.averagePrice = getAveragePrice(updatedPriceHistory);
                product.currentPrice = scrapedProduct.currentPrice;
                const savedProduct = await product.save();
                // Check if there are any users to notify
                if (scrapedProduct.currentPrice < product.currentPrice) {
                    for (const userId of savedProduct.users) {
                        const user = await userRepo.findOne({ filter: { _id: userId } });
                        if (user) {
                            const emailContent = (0, notification_1.generateEmailBody)(savedProduct, notification_1.NOTIFICATION_TYPE.CHANGE_OF_STOCK);
                            await (0, send_email_1.sendEmail)({
                                to: user.email,
                                subject: emailContent.subject,
                                html: emailContent.body,
                            });
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error("Error in cron job:", error);
        }
    });
};
exports.startCronJobs = startCronJobs;
