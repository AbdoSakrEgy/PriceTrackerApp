"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerServices = void 0;
const successHandler_1 = require("../../utils/successHandler");
const tracker_repo_1 = require("./tracker.repo");
const product_repo_1 = require("../product/product.repo");
class TrackerServices {
    trackerRepo = new tracker_repo_1.TrackerRepo();
    productRepo = new product_repo_1.ProductRepo();
    constructor() { }
    // ============================ createTracker ============================
    createTracker = async (req, res, next) => {
        return (0, successHandler_1.successHandler)({ res });
    };
    // ============================ checkPrices ============================
    checkPrices = async (req, res, next) => {
        return (0, successHandler_1.successHandler)({ res });
    };
}
exports.TrackerServices = TrackerServices;
