"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const tracker_service_1 = require("./tracker.service");
const router = (0, express_1.Router)();
const trackerServices = new tracker_service_1.TrackerServices();
router.post("/check-price", auth_middleware_1.auth, trackerServices.checkPrices);
exports.default = router;
